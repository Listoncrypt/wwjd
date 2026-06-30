import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const LANGUAGE_NAMES: Record<string, string> = {
  en: "English",
  fr: "French",
  es: "Spanish",
  ig: "Igbo",
  yo: "Yoruba",
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const getSystemPrompt = (language: string) => {
  const langName = LANGUAGE_NAMES[language] || "English";

  return `You are a wise, compassionate spiritual guide who answers questions based on the teachings of Jesus Christ and the Bible. Your role is to help people understand what Jesus would do in various situations.

IMPORTANT: You MUST respond entirely in ${langName}. The user's selected language is ${langName}, so your answer must be written in ${langName}.

When answering questions:
1. Draw wisdom from Jesus's teachings, parables, and actions as recorded in the Bible
2. Be compassionate, non-judgmental, and encouraging
3. Provide practical guidance that reflects Christ's love and wisdom
4. Reference specific Bible verses that support your answer (keep verse references in their original format like "John 3:16")
5. Keep answers clear, warm, and accessible to all readers
6. If a question is outside the scope of Christian teachings, gently redirect to relevant biblical principles

You MUST respond with valid JSON only. Use this exact format:
{"answer": "Your thoughtful response here in ${langName} (2-4 paragraphs)", "verses": ["John 3:16", "Matthew 5:44"]}

Do not include any text outside the JSON object. Remember: The answer MUST be in ${langName}.`;
};

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { question, language = "en" } = await req.json();

    if (!question || question.length < 1 || question.length > 1000) {
      return new Response(
        JSON.stringify({ error: { message: "Invalid question", code: "VALIDATION_ERROR" } }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const openaiApiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openaiApiKey) {
      return new Response(
        JSON.stringify({ error: { message: "OpenAI API key not configured", code: "CONFIG_ERROR" } }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const systemPrompt = getSystemPrompt(language);
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: question },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenAI API error:", errorText);
      return new Response(
        JSON.stringify({ error: { message: "Failed to get response from AI", code: "AI_ERROR" } }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const outputText = data.choices?.[0]?.message?.content;

    if (!outputText) {
      return new Response(
        JSON.stringify({ error: { message: "No response text from AI", code: "AI_ERROR" } }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse the JSON response from the AI
    let parsedResponse: { answer: string; verses: string[] };
    try {
      const jsonMatch = outputText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedResponse = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch {
      parsedResponse = {
        answer: outputText,
        verses: [],
      };
    }

    if (!parsedResponse.answer) {
      parsedResponse.answer = outputText;
    }
    if (!parsedResponse.verses || !Array.isArray(parsedResponse.verses)) {
      parsedResponse.verses = [];
    }

    return new Response(
      JSON.stringify({ data: parsedResponse }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({ error: { message: "Internal server error", code: "INTERNAL_ERROR" } }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
