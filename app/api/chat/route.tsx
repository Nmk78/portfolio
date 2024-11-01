import { ragChat } from "@/lib/rag-chat";
import { NextRequest, NextResponse } from "next/server";
import { aiUseChatAdapter } from "@upstash/rag-chat/nextjs";

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
        { status: 4000 }
      );
    }

    const res = await ragChat.chat(lastMessage, { streaming: true, sessionId });
    console.log("🚀 ~ res:", res);

    // const responseEnvelope = {
    //   status: "success",
    //   message: "Response from chatbot",
    //   data: res,
    // };

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
