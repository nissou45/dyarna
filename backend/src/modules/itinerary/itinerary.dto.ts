import { z } from 'zod';

export const dayInputSchema = z.object({
  cityId: z.string().min(1, 'cityId requis.'),
  nightsCount: z.number().int().min(1, 'nightsCount doit être ≥ 1.'),
  notes: z.string().max(500).trim().optional(),
});

export const createItinerarySchema = z.object({
  title: z.string().min(3, 'Le titre doit faire au moins 3 caractères.').max(120).trim(),
  days: z.array(dayInputSchema).min(1, 'Au moins une étape est requise.'),
});

export const updateItinerarySchema = z.object({
  title: z.string().min(3).max(120).trim().optional(),
  days: z.array(dayInputSchema).min(1).optional(),
});

export const reorderSchema = z.object({
  dayIds: z.array(z.string().min(1)).min(1, 'Au moins une étape est requise.'),
});

export type CreateItineraryDto = z.infer<typeof createItinerarySchema>;
export type UpdateItineraryDto = z.infer<typeof updateItinerarySchema>;
export type ReorderDto = z.infer<typeof reorderSchema>;
