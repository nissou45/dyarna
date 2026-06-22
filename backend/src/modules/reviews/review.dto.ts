import { z } from 'zod';

export const createReviewSchema = z.object({
  rating: z
    .number()
    .int('La note doit être un nombre entier.')
    .min(1, 'Note minimale: 1.')
    .max(5, 'Note maximale: 5.'),
  comment: z
    .string()
    .min(10, 'Le commentaire doit faire au moins 10 caractères.')
    .max(1000, 'Le commentaire doit faire au maximum 1000 caractères.')
    .trim()
    .transform((val) => val.replace(/<[^>]*>/g, '')),
});

export const updateReviewSchema = z.object({
  rating: z
    .number()
    .int('La note doit être un nombre entier.')
    .min(1, 'Note minimale: 1.')
    .max(5, 'Note maximale: 5.')
    .optional(),
  comment: z
    .string()
    .min(10, 'Le commentaire doit faire au moins 10 caractères.')
    .max(1000, 'Le commentaire doit faire au maximum 1000 caractères.')
    .trim()
    .transform((val) => val.replace(/<[^>]*>/g, ''))
    .optional(),
});

export const moderateReviewSchema = z.object({
  status: z.enum(['visible', 'rejected']),
});

export type CreateReviewDto = z.infer<typeof createReviewSchema>;
export type UpdateReviewDto = z.infer<typeof updateReviewSchema>;
export type ModerateReviewDto = z.infer<typeof moderateReviewSchema>;
