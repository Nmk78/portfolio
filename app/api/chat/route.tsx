// // import { google } from '@ai-sdk/google';
// // import { streamText, StreamingTextResponse, Message, LanguageModelV1 } from "ai";
// // import { prisma } from "@/lib/prisma";

// // export const dynamic = "force-dynamic";
// // export const maxDuration = 30;

// // export async function POST(req: Request) {
// //   // The 'messages' array contains the full chat history from the frontend
// //   const { messages }: { messages: Message[] } = await req.json();

// //   try {
// //     // --- Context/Setup Logic ---
// //     const contextData = await prisma.chatContext.findFirst();
// //     if (!contextData) {
// //       throw new Error("No context found in the database.");
// //     }

// //     const systemPrompt = `You are a helpful assistant representing Nay Myo Khant. Your responses should be based on the following context about him. Be friendly, professional, and act as if you are Nay Myo Khant himself. Here is the context:\n\n${contextData.content}`;

// //     if (!process.env.GEMINI_API_KEY) {
// //       throw new Error("GEMINI_API_KEY is not set in the environment variables.");
// //     }
// //     const result = streamText({
// //       model: google('gemini-2.5-flash') as unknown as LanguageModelV1,
// //       system: systemPrompt,
// //       messages: messages,
// //     });
// //     // console.log("🚀 ~ POST ~ result:", result.text)

// //     // return new StreamingTextResponse(result.toAIStream());
// //     // Option 1 (Recommended for useChat/rich UI) - Keep this:
// //     return (await result).toDataStreamResponse();

// //     // Option 2 (Text only stream) - Try this if Option 1 fails:
// //     // return result.toTextStreamResponse();

// //     // Option 3 (Old SDK) - Avoid this if you are on the new AI SDK (v3+):
// //     // return new StreamingTextResponse(result.toAIStream());

// //   } catch (error) {
// //     console.error("Chatbot error:", error);
// //     return new Response(
// //       `Failed to get response from chatbot. Error: ${error instanceof Error ? error.message : "An unknown error occurred."}`,
// //       { status: 500 }
// //     );
// //   }
// // }

// // import { LanguageModelV1, streamText } from "ai";
// // import { google } from '@ai-sdk/google';

// // export async function POST(req: Request) {
// //   try {
// //     const { prompt } = await req.json();

// //     const result = streamText({
// //       model: google("gemini-2.5-flash") as unknown as LanguageModelV1,
// //       prompt,
// //     });

// //     return (await result).toDataStreamResponse();
// //   } catch (error) {
// //     console.error("Error streaming text:", error);
// //     return new Response("Failed to stream text", { status: 500 });
// //   }
// // }

// import { LanguageModelV1, streamText } from "ai";
// import { google } from '@ai-sdk/google';
// export const runtime = 'nodejs'; // 👈 important, don't use edge unless needed

// export async function POST(req: Request) {
//   try {
//     const { prompt } = await req.json();

//     const result = await streamText({ // Note: Awaiting streamText for reliable usage logging
//       model: google("gemini-2.5-flash") as unknown as LanguageModelV1,
//       prompt,
//     });

//     // Log token usage after streaming completes
//     // 'result' is now the StreamableText object, which has the usage promise.
//     result.usage.then((usage) => {
//       console.log({

//         // inputTokens: usage?.inputTokens,
//         // outputTokens: usage?.outputTokens,
//         totalTokens: usage?.totalTokens,
//       });
//     });

//     // Use the new method to return the response
//     return result.toDataStreamResponse();
//   } catch (error) {
//     console.error("Error streaming text:", error);
//     return new Response("Failed to stream text", { status: 500 });
//   }
// }

// app/api/chat/route.ts
import { convertToModelMessages, generateId, LanguageModel, streamText } from "ai";
import { google } from "@ai-sdk/google";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const contextData = await prisma.chatContext.findFirst();
    if (!contextData) {
      throw new Error("No context found in the database.");
    }

    const systemPrompt = `You are a helpful assistant representing Nay Myo Khant. Your responses should be based on the following context about him. Be friendly, professional, and act as if you are Nay Myo Khant himself. Here is the context:\n\n${contextData.content}`;


    const { messages } = await req.json();
    const result = streamText({
      model: google("gemini-2.5-flash") as unknown as LanguageModel,
      prompt: convertToModelMessages(messages),
      system: systemPrompt,
      // messages,
    });

    // return result.toUIMessageStreamResponse();
    return result.toUIMessageStreamResponse({
      originalMessages: messages, // Pass original messages for context
      generateMessageId: () => generateId(), // ID generation moved here for UI messages
      // onFinish: ({ messages, responseMessage }) => {
      //   // messages contains all messages (original + response) in UIMessage format
      //   saveChat({ chatId, messages });
    
      //   // responseMessage contains just the generated message in UIMessage format
      //   saveMessage({ chatId, message: responseMessage });
      // },
    });
  } catch (error) {
    console.error(error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
