import { z } from 'zod';

export const createUserSchema = z.object({
  body: z.object({
    name: z.string().min(3, "Name must be at least 3 characters").max(50, "Name must be less than 50 characters"),
    email: z.string().email("Please provide a valid email address"),
    password: z.string().min(5, "Password must be at least 5 characters").max(100, "Password is too long"),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email("Please provide a valid email address"),
    password: z.string().min(1, "Password is required"),
  }),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
