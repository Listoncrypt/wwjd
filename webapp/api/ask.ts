import type { VercelRequest, VercelResponse } from '@vercel/node';

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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: { message: 'Method not allowed', code: 'METHOD_ERROR' } });
  }

  const { question, language } = req.body || {};

  if (!question) {
    return res.status(400).json({ error: { message: 'Question is required', code: 'VALIDATION_ERROR' } });
  }

  try {
    const systemPrompt = getSystemPrompt(language || 'en');

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error("OPENAI_API_KEY not set");
      return res.status(500).json({ error: { message: "AI service not configured", code: "CONFIG_ERROR" } });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: question },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenAI API error:", errorText);
      return res.status(500).json({ error: { message: "Failed to get response from AI", code: "AI_ERROR" } });
    }

    const data = await response.json() as {
      choices?: Array<{
        message?: { content?: string }
      }>
    };

    const outputText = data.choices?.[0]?.message?.content;

    if (!outputText) {
      console.error("No output text found in response:", data);
      return res.status(500).json({ error: { message: "No response text from AI", code: "AI_ERROR" } });
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

    return res.status(200).json({ data: parsedResponse });
  } catch (error) {
    console.error("Error processing request:", error);
    return res.status(500).json({ error: { message: "Internal server error", code: "INTERNAL_ERROR" } });
  }
}
