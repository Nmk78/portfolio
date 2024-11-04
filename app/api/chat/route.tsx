import { ragChat } from "@/lib/rag-chat";
import { NextRequest, NextResponse } from "next/server";
import { aiUseChatAdapter } from "@upstash/rag-chat/nextjs";
import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis";

// export async function POST(request: NextRequest) {
//   try {
//     // Parse the request body
//     const { sessionId, messages } = await request.json();
//     console.log("🚀 ~ messages:", messages);

//     const lastMessage = messages[messages.length - 1].content;
//     console.log("🚀 ~ lastMessage:", lastMessage);

//     if (!sessionId) {
//       return NextResponse.json(
//         {
//           status: "error",
//           message: "Session ID is missing.",
//           data: null,
//         },
//         { status: 4000 }
//       );
//     }

//     const res = await ragChat.chat(lastMessage, { streaming: true, sessionId });
//     console.log("🚀 ~ res:", res);

//     // const responseEnvelope = {
//     //   status: "success",
//     //   message: "Response from chatbot",
//     //   data: res,
//     // };

//     return aiUseChatAdapter(res);
//   } catch (error) {
//     console.error("Chatbot error:", error);

//     return NextResponse.json(
//       {
//         status: "error",
//         message: "Failed to get response from chatbot.",
//         error: error,
//         data: null,
//       },
//       { status: 500 }
//     );
//   }
// }

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const { sessionId, messages } = await request.json();
    console.log("🚀 ~ messages:", messages);

    const lastMessage = messages[messages.length - 1].content;
    console.log("🚀 ~ lastMessage:", lastMessage);

    if (!sessionId) {
      return NextResponse.json(
        {
          status: "error",
          message: "Session ID is missing.",
          data: null,
        },
        { status: 400 }
      );
    }

    // Fetch context from the database
    const contextData = await prisma.chatContext.findFirst();
    if (contextData) {
      const exists = await redis.sismember("contextId", contextData.id);
      if (!exists) {
        // If the ID does not exist, add the new context
        await ragChat.context.add({
          type: "text",
          data: contextData.content,
        });
        // Add the context ID to Redis to prevent future duplicates
        await redis.sadd("contextId", contextData.id);
        console.log(
          `Context with ID ${contextData.id} added and tracked in Redis.`
        );
      } else {
        console.log(
          `Context with ID ${contextData.id} already exists. Skipping addition.`
        );
      }
    }

    // Ensure the context data is available
    if (!contextData) {
      throw new Error("No context found in the database.");
    }

    const res = await ragChat.chat(lastMessage, {
      streaming: true,
      sessionId,
    });
    console.log("🚀 ~ res:", res);

    // Return the response wrapped in your aiUseChatAdapter (assuming it's your formatter)
    return aiUseChatAdapter(res);
  } catch (error) {
    console.error("Chatbot error:", error);

    return NextResponse.json(
      {
        status: "error",
        message: "Failed to get response from chatbot.",
        error: error,
        data: null,
      },
      { status: 500 }
    );
  }
}
