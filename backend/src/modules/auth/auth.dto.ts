import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Email invalide.').transform((e) => e.toLowerCase()),
  password: z.string().min(8, 'Le mot de passe doit faire au moins 8 caractères.'),
  displayName: z.string().min(2, 'Le nom doit faire au moins 2 caractères.').max(50),
});

export const loginSchema = z.object({
  email: z.string().email('Email invalide.').transform((e) => e.toLowerCase()),
  password: z.string().min(1, 'Mot de passe requis.'),
});

export type RegisterDto = z.infer<typeof registerSchema>;
export type LoginDto = z.infer<typeof loginSchema>;
