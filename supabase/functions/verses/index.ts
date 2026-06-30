import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const ref = url.searchParams.get("ref");

    if (!ref) {
      return new Response(
        JSON.stringify({ error: { message: "Verse reference is required", code: "VALIDATION_ERROR" } }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch from Bible API
    const bibleApiUrl = `https://bible-api.com/${encodeURIComponent(ref)}`;
    const response = await fetch(bibleApiUrl);

    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: { message: "Verse not found", code: "NOT_FOUND" } }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();

    const verseResponse = {
      reference: data.reference || ref,
      text: data.text || "",
      verses: (data.verses || []).map((v: { book_name: string; chapter: number; verse: number; text: string }) => ({
        book_name: v.book_name,
        chapter: v.chapter,
        verse: v.verse,
        text: v.text,
      })),
    };

    return new Response(
      JSON.stringify({ data: verseResponse }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error fetching verse:", error);
    return new Response(
      JSON.stringify({ error: { message: "Failed to fetch verse", code: "INTERNAL_ERROR" } }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
