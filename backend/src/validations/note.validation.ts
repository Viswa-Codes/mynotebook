import { z } from 'zod';

export const createNoteSchema = z.object({
  body: z.object({
    title: z.string().min(3, "Title must be at least 3 characters").max(100, "Title must be less than 100 characters"),
    description: z.string().min(5, "Description must be at least 5 characters").max(5000, "Description is too long"),
    tag: z.string().optional().default("General"),
  }),
});

export const updateNoteSchema = z.object({
  body: z.object({
    title: z.string().min(3, "Title must be at least 3 characters").max(100, "Title must be less than 100 characters").optional(),
    description: z.string().min(5, "Description must be at least 5 characters").max(5000, "Description is too long").optional(),
    tag: z.string().optional(),
  }),
});

export type CreateNoteInput = z.infer<typeof createNoteSchema>;
export type UpdateNoteInput = z.infer<typeof updateNoteSchema>;
