import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";
import type { GenerateAITextParams } from "../types/index";

const googleAI = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export const generateAIText = async ({
  system,
  prompt,
}: GenerateAITextParams): Promise<string> => {
  const { text } = await generateText({
    model: googleAI("gemini-2.5-flash"),
    system,
    prompt,
  });

  return text;
};
