import { Injectable } from '@angular/core';

export interface WikipediaSummary {
  title: string;
  description: string;
  extract: string;
  thumbnail: { source: string; width: number; height: number } | null;
  originalimage: { source: string; width: number; height: number } | null;
  coordinates?: { lat: number; lon: number };
  content_urls: {
    desktop: { page: string };
  };
}

@Injectable({
  providedIn: 'root',
})
export class WikipediaService {
  private readonly BASE = 'https://en.wikipedia.org/api/rest_v1/page/summary';

  /**
   * Récupère le résumé Wikipedia d'un sujet (ville, plat, tradition…)
   * Retourne null si le terme n'est pas trouvé.
   *
   * Aucune clé API requise — API REST publique de Wikipedia.
   * Rate limit : ~200 req/s (on ne l'atteindra jamais).
   */
  async getSummary(term: string): Promise<WikipediaSummary | null> {
    const encoded = encodeURIComponent(term);
    try {
      const response = await fetch(`${this.BASE}/${encoded}`, {
        headers: { 'User-Agent': 'MarocGuide/1.0 (travel-app)' },
        signal: AbortSignal.timeout(8000),
      });

      if (response.status === 404) return null;
      if (!response.ok) {
        console.warn(`[WikipediaService] HTTP ${response.status} for "${term}"`);
        return null;
      }

      const data: WikipediaSummary & { type?: string } = await response.json();
      // Si le type est "disambiguation", on ignore
      if (data.type === 'disambiguation') return null;

      return data;
    } catch (err) {
      console.warn(`[WikipediaService] Failed to fetch "${term}":`, err);
      return null;
    }
  }

  /**
   * Récupère la plus grande photo disponible pour un terme.
   * Retourne l'image originale si disponible, sinon la miniature, sinon null.
   */
  async getPhotoUrl(term: string, size: 'thumb' | 'original' = 'original'): Promise<string | null> {
    const summary = await this.getSummary(term);
    if (!summary) return null;
    if (size === 'original' && summary.originalimage) return summary.originalimage.source;
    if (summary.thumbnail) return summary.thumbnail.source;
    return null;
  }

  /**
   * Récupère la meilleure photo disponible (priorité à l'original).
   */
  async getBestPhotoUrl(term: string): Promise<string | null> {
    return this.getPhotoUrl(term, 'original');
  }
}
