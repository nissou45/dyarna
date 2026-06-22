import { z } from 'zod';
import { RawWikiContent } from './wikipedia.provider';

const HISTORY_KEYWORDS = ['histoire', 'fonder', 'création', 'origine', 'fondation', 'siècle', 'époque'];
const TRADITIONS_KEYWORDS = ['tradition', 'festival', 'célébration', 'fête', 'artisanat', 'moussem', 'rituel'];
const LEGEND_KEYWORDS = ['légende', 'mythe', 'histoire raconte', 'on dit que', 'selon la légende'];
const CUISINE_KEYWORDS = ['cuisine', 'gastronomie', 'plat', 'recette', 'culinaire', 'mets', 'saveur', 'épice'];

export const claudeOutputSchema = z.object({
  history: z.string().min(10, 'L\'histoire doit faire au moins 10 caractères.'),
  traditions: z.array(z.string().min(3)).min(1, 'Au moins une tradition est requise.'),
  legend: z
    .object({
      title: z.string().min(2),
      content: z.string().min(10),
    })
    .nullable(),
  cuisine: z
    .array(
      z.object({
        name: z.string().min(2),
        description: z.string().min(10),
      }),
    )
    .min(1, 'Au moins un plat est requis.'),
});

export type ClaudeOutput = z.infer<typeof claudeOutputSchema>;

interface StructuredCulture {
  history: string;
  traditions: string[];
  legend: { title: string; content: string } | null;
  cuisine: { name: string; description: string }[];
}

function extractSection(text: string, keywords: string[]): string[] {
  const paragraphs = text.split('\n').filter((p) => p.trim().length > 30);
  const matched = new Set<string>();
  for (const p of paragraphs) {
    const lower = p.toLowerCase();
    if (keywords.some((kw) => lower.includes(kw))) {
      matched.add(p.trim());
    }
  }
  const firstFallback = text.length > 100 ? text.slice(0, 500).trim() : '';
  return matched.size > 0 ? [...matched] : firstFallback ? [firstFallback] : [];
}

export function structureWithHeuristics(raw: RawWikiContent): StructuredCulture {
  const history = extractSection(raw.extract, HISTORY_KEYWORDS).slice(0, 3).join('\n\n');
  const traditions = extractSection(raw.extract, TRADITIONS_KEYWORDS).slice(0, 5);
  const legendTexts = extractSection(raw.extract, LEGEND_KEYWORDS).slice(0, 2);
  const cuisineTexts = extractSection(raw.extract, CUISINE_KEYWORDS).slice(0, 4);

  const legend =
    legendTexts.length > 0
      ? { title: 'Légende', content: legendTexts.join('\n\n') }
      : null;

  const cuisine = cuisineTexts.length > 0
    ? cuisineTexts.map((t) => ({
        name: raw.title,
        description: t,
      }))
    : [{ name: raw.title, description: raw.extract.slice(0, 200) + '…' }];

  const fallbackHistory = history || raw.extract.slice(0, 800).trim() || raw.title;

  return {
    history: fallbackHistory,
    traditions: traditions.length > 0 ? traditions : ['À découvrir sur place.'],
    legend,
    cuisine,
  };
}

export function needsClaude(heuristic: StructuredCulture, raw: RawWikiContent): boolean {
  const wordCount = (s: string) => s.split(/\s+/).length;
  const hasThinHistory = wordCount(heuristic.history) < 15;
  const hasThinTraditions = heuristic.traditions.length === 0;
  const hasThinCuisine = heuristic.cuisine.length === 0 || heuristic.cuisine.every((c) => wordCount(c.description) < 8);
  return hasThinHistory || hasThinTraditions || hasThinCuisine;
}

export async function structureWithClaude(raw: RawWikiContent, apiKey: string): Promise<StructuredCulture | null> {
  const prompt = `Tu es un expert du patrimoine culturel marocain. Structure le texte Wikipedia suivant en JSON valide selon le schéma ci-dessous. Ne réponds qu'avec le JSON, sans préambule ni markdown.

Schéma attendu:
{
  "history": "texte long — l'histoire et l'origine de la ville",
  "traditions": ["tradition 1", "tradition 2", …],
  "legend": {"title": "titre court", "content": "texte de la légende"} ou null s'il n'y a pas de légende,
  "cuisine": [{"name": "nom du plat", "description": "description du plat"}, …]
}

Instructions:
- Reformule, ne copie pas verbatim. Limite les citations directes.
- Extrais au moins 2 traditions et 2 plats si le texte le permet.
- Si le texte ne mentionne pas de légende, mets "legend": null.
- Retourne UNIQUEMENT le JSON, pas de texte avant ou après.

Texte Wikipedia pour "${raw.title}":
${raw.extract.slice(0, 4000)}`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-5-haiku-latest',
        max_tokens: 2000,
        temperature: 0.1,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) {
      console.warn(`[Structurer] Claude API error: ${response.status} ${await response.text()}`);
      return null;
    }

    const data = await response.json() as { content?: { text?: string }[] };
    const content = data.content?.[0]?.text;
    if (!content) {
      console.warn('[Structurer] Empty Claude response');
      return null;
    }

    const cleaned = content.replace(/```json?/gi, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleaned);
    const validated = claudeOutputSchema.parse(parsed);

    return {
      history: validated.history,
      traditions: validated.traditions,
      legend: validated.legend,
      cuisine: validated.cuisine,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.warn(`[Structurer] Claude structuring failed: ${message}`);
    return null;
  }
}

export async function structureContent(raw: RawWikiContent): Promise<{
  content: StructuredCulture;
  usedClaude: boolean;
}> {
  const heuristic = structureWithHeuristics(raw);
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (apiKey && needsClaude(heuristic, raw)) {
    const claudeResult = await structureWithClaude(raw, apiKey);
    if (claudeResult) {
      return { content: claudeResult, usedClaude: true };
    }
    console.warn('[Structurer] Claude failed, falling back to heuristic result');
  }

  return { content: heuristic, usedClaude: false };
}
