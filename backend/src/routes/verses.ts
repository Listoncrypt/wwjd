import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { VerseResponseSchema } from "../types.js";

const versesRouter = new Hono();

const QuerySchema = z.object({
  ref: z.string().min(1, "Verse reference is required"),
});

versesRouter.get("/", zValidator("query", QuerySchema), async (c) => {
  const { ref } = c.req.valid("query");

  try {
    // Call the free Bible API
    const encodedRef = encodeURIComponent(ref);
    const response = await fetch(`https://bible-api.com/${encodedRef}`);

    if (!response.ok) {
      if (response.status === 404) {
        return c.json(
          { error: { message: "Verse not found", code: "VERSE_NOT_FOUND" } },
          404
        );
      }
      return c.json(
        { error: { message: "Failed to fetch verse", code: "FETCH_ERROR" } },
        500
      );
    }

    const apiData = await response.json();

    // Transform the API response to match our schema
    const verseResponse = {
      reference: apiData.reference,
      text: apiData.text,
      verses: apiData.verses.map((v: any) => ({
        book_name: v.book_name,
        chapter: v.chapter,
        verse: v.verse,
        text: v.text,
      })),
    };

    // Validate response matches our schema
    const parsed = VerseResponseSchema.safeParse(verseResponse);
    if (!parsed.success) {
      return c.json(
        { error: { message: "Invalid response from Bible API", code: "PARSE_ERROR" } },
        500
      );
    }

    return c.json({ data: parsed.data });
  } catch (error) {
    console.error("Error fetching verse:", error);
    return c.json(
      { error: { message: "Failed to fetch verse", code: "FETCH_ERROR" } },
      500
    );
  }
});

export { versesRouter };
