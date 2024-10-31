import { ragChat } from "@/lib/rag-chat";
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis";
import { Context } from "@/lib/types";

async function chatWithContext(userMessage: string, sessionId: string) {
  let preDefinedContext = "I like pear";

  // Fetch context from the database
  const contextData = await prisma.chatContext.findFirst();

  if (contextData) {
    const exists = await redis.sismember("contextId", contextData.id);

    if (!exists) {
      // If the ID does not exist, add the new context
      await ragChat.context.add(contextData.content || "");

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

  // Combine context with the user message
  const completeMessage = `${contextData.content}\nUser: ${userMessage}\nAssistant:`;

  console.log("🚀 ~ chatWithContext ~ completeMessage:", completeMessage);

  // Call the chat method with the complete message
  const response = await ragChat.chat(completeMessage, {
    streaming: true,
    sessionId: sessionId,
  });
  return response;
}

// POST handler for the API route
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("sessionId");

  if (!sessionId) {
    return NextResponse.json(
      { error: "Session ID is required" },
      { status: 400 }
    );
  }

  try {
    const initialMessages = await ragChat.history.getMessages({
      amount: 10,
      sessionId,
    });
    console.log("🚀 ~ GET ~ initialMessages:", initialMessages);

    return NextResponse.json(initialMessages, { status: 200 });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}

// POST handler for Next.js API route
// export async function POST(request: NextRequest) {
//   // Parse the request body
//   const body = await request.json();

//   // Validate message input
//   if (!body?.message) {
//     const errorResponseEnvelope = {
//       status: "error",
//       error: "no message",
//       message: "Message is required to interact with the assistant.",
//       data: null,
//     };
//     return NextResponse.json(errorResponseEnvelope, { status: 400 });
//   }

//   // Get response from chatbot
//   try {
//     const msg = await chatWithContext(body.message);

//     const responseEnvelope = {
//       status: "success",
//       message: "Response from chatbot",
//       data: msg,
//     };

//     return NextResponse.json(responseEnvelope, { status: 200 });
//   } catch (error) {
//     console.error("Chatbot error:", error);

//     const errorResponseEnvelope = {
//       status: "error",
//       message: "Failed to get response from chatbot.",
//       data: null,
//     };

//     return NextResponse.json(errorResponseEnvelope, { status: 500 });
//   }
// }

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    console.log("🚀 ~ POST ~ body:", body.messages[0]);

    // Ensure 'messages' exists, is an array, and has at least one element
    if (!body?.messages || !Array.isArray(body.messages) || body.messages.length === 0) {
      return NextResponse.json({ error: 'No messages provided' }, { status: 400 });
    }

    // Get the session ID from the request body (if available)
    const { sessionId } = body;
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

    // Pass the message and sessionId to the chat function
    const msg = await chatWithContext(body.messages[0].content, sessionId);

    const responseEnvelope = {
      status: "success",
      message: "Response from chatbot",
      data: msg,
    };

    return NextResponse.json(responseEnvelope, { status: 200 });
  } catch (error) {
    console.error("Chatbot error:", error);

    return NextResponse.json(
      {
        status: "error",
        message: "Failed to get response from chatbot.",
        data: null,
      },
      { status: 500 }
    );
  }
}
