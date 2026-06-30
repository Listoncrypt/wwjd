import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { AskRequestSchema, AskResponseSchema } from "../types.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { env } from "../env.js";

const askRouter = new Hono();

const LANGUAGE_NAMES: Record<string, string> = {
  en: "English",
  fr: "French",
  es: "Spanish",
  ig: "Igbo",
  yo: "Yoruba",
};

const getSystemPrompt = (language: string) => {
  const langName = LANGUAGE_NAMES[language] || "English";

  return `You are a wise, compassionate spiritual guide who answers questions based on the teachings of Jesus Christ and the Bible. Your role is to help people understand what Jesus would do in various situations.

IMPORTANT: You MUST respond entirely in ${langName}. The user's selected language is ${langName}, so your answer must be written in ${langName}.

When answering questions:
1. You MUST speak STRICTLY in alignment with the teachings of Jesus Christ as recorded in the Gospels.
2. Draw wisdom directly from Jesus's parables, Sermon on the Mount, and His actions.
3. Be compassionate, non-judgmental, and encouraging, embodying the pure love of Christ.
4. Reference specific Bible verses that support your answer (keep verse references in their original format like "John 3:16").
5. Keep answers clear, warm, and accessible to all readers.
6. If a question is outside the scope of Christian teachings, gently redirect to relevant biblical principles taught by Jesus.
7. Do NOT break character. You are a spiritual guide conveying the teachings of Jesus.

You MUST respond with valid JSON only. Use this exact format:
{"answer": "Your thoughtful response here in ${langName} (2-4 paragraphs). Use \\n for line breaks, do NOT use literal newlines.", "verses": ["John 3:16", "Matthew 5:44"]}

Do not include any text outside the JSON object. Remember: The answer MUST be in ${langName}.`;
};

askRouter.post("/", zValidator("json", AskRequestSchema), async (c) => {
  const { question, language, history } = c.req.valid("json");

  try {
    const systemPrompt = getSystemPrompt(language || 'en');
    const apiKey = env.GEMINI_API_KEY;
    
    console.log("Using GEMINI_API_KEY (first 10 chars):", apiKey.substring(0, 10), "...");

    // Initialize Google Generative AI
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      systemInstruction: systemPrompt 
    });

    console.log("Sending chat request to Gemini with history length:", history?.length || 0);
    
    const chat = model.startChat({
      history: history || [],
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    const result = await chat.sendMessage(question);
    const response = await result.response;
    const outputText = response.text();
    
    console.log("Gemini raw response received");

    if (!outputText) {
      console.error("No output text found in response");
      return c.json(
        { error: { message: "No response text from AI", code: "AI_ERROR" } },
        500
      );
    }

    // Parse the JSON response from the AI
    let parsedResponse: { answer: string; verses: string[] };
    try {
      // Try to extract JSON from the response
      const jsonMatch = outputText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedResponse = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (parseError) {
      console.log("JSON parse failed, using raw text:", parseError);
      // If parsing fails, use the raw text as the answer
      parsedResponse = {
        answer: outputText,
        verses: [],
      };
    }

    // Ensure the response has the expected structure
    if (!parsedResponse.answer) {
      parsedResponse.answer = outputText;
    }
    if (!parsedResponse.verses || !Array.isArray(parsedResponse.verses)) {
      parsedResponse.verses = [];
    }

    // Validate the response
    const validatedResponse = AskResponseSchema.parse(parsedResponse);

    return c.json({ data: validatedResponse });
  } catch (error) {
    console.error("Error processing request:", JSON.stringify(error, null, 2));
    return c.json(
      { error: { message: "Internal server error", code: "INTERNAL_ERROR" } },
      500
    );
  }
});

export { askRouter };
