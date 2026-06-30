import { z } from "zod";

// WWJD Ask API
export const AskRequestSchema = z.object({
  question: z.string().min(1).max(1000),
  language: z.enum(['en', 'fr', 'es', 'ig', 'yo']).optional().default('en'),
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    parts: z.array(z.object({ text: z.string() })),
  })).optional().default([]),
});

export const AskResponseSchema = z.object({
  answer: z.string(),
  verses: z.array(z.string()),
});

export type AskRequest = z.infer<typeof AskRequestSchema>;
export type AskResponse = z.infer<typeof AskResponseSchema>;

// Bible Verse API
export const VerseResponseSchema = z.object({
  reference: z.string(),
  text: z.string(),
  verses: z.array(z.object({
    book_name: z.string(),
    chapter: z.number(),
    verse: z.number(),
    text: z.string(),
  })),
});

export type VerseResponse = z.infer<typeof VerseResponseSchema>;
