import { convertToModelMessages, generateId, LanguageModel, streamText } from "ai";
import { google } from "@ai-sdk/google";
import { prisma } from "@/lib/prisma";
import { errorEnvelope } from "@/lib/envelope";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const contextData = await prisma.chatContext.findFirst();
    
    const systemPrompt = contextData?.content 
      ? `You are a helpful assistant representing Nay Myo Khant. Your responses should be based on the following context about him. Be friendly, professional, and act as if you are Nay Myo Khant himself. Here is the context:\n\n${contextData.content}`
      : `You are a helpful assistant representing Nay Myo Khant. Be friendly, professional, and act as if you are Nay Myo Khant himself.`;

    const { messages } = await req.json();
    const result = streamText({
      model: google("gemini-2.5-flash") as unknown as LanguageModel,
      prompt: convertToModelMessages(messages),
      system: systemPrompt,
    });

    return result.toUIMessageStreamResponse({
      originalMessages: messages,
      generateMessageId: () => generateId(),
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
