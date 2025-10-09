"use client";

import React, { useEffect, useRef, useState } from "react";
import { useChat, UIMessage } from "@ai-sdk/react";
// import { Messages } from "./Messages";
import { PlaceholdersAndVanishInput } from "./ui/placeholders-and-vanish-input";
import { DefaultChatTransport } from "ai";
import { Message } from "./Message";
import { MessageSquare } from "lucide-react";

export const ChatWrapper = ({}: //   sessionId,
// initialMessages,
{
  sessionId?: string | null;
  // initialMessages: UIMessage[] | undefined;
}) => {
  const [input, setInput] = useState("");
  const [initialMessages] = useState<UIMessage[]>([]);
  const { messages, sendMessage, status, error, stop } = useChat({
    messages: initialMessages,
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });

  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  const placeholders = [
    "Who is Nay Myo Khant?",
    "What projects has Nay Myo Khant worked on?",
    "What skills does Nay Myo Thura Kyaw specialize in?",
    "How did the USC Myeik King and Queen Selection app perform?",
    "What technologies does he use for full-stack development?",
  ];

  return (
    <div className="w-[95vw] h-[65vh] mx-auto md:mx-0 md:w-screen relative md:bg-red-100">
      <div className="w-full max-w-xl mx-auto h-full rounded-b-3xl bg-transparent bg-gray-100 flex flex-col">
        {/* Messages container */}
        <div className="flex-1 bg-gray-100 overflow-hidden relative">
          <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-white via-gray-100/50 to-transparent pointer-events-none z-10" />
          <div className="w-full h-full">
            <div
              ref={containerRef}
              className="h-full flex flex-col justify-end overflow-y-auto pt-12 scrollbar-thin custom-scrollbar"
              // className="messages-container custom-scrollbar pb-3"
            >
              {messages?.length > 0 ? (
                messages.map((message, i) => (
                  <Message
                    key={message.id || i}
                    content={
                      message.parts
                        .filter((part) => part.type === "text") // Only process text parts
                        .map((part) => part.text)
                        .join("") // Concatenate all parts into a single string
                    }
                    isUserMessage={message.role === "user"}
                  />
                ))
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center gap-2 flex-shrink-0">
                  <MessageSquare className="h-8 w-8 text-red-500" />
                  <h3 className="font-semibold text-xl text-red-500">
                    Ask about me!
                  </h3>
                  <p className="text-zinc-500 text-sm">
                    Ask your first question to get started.
                  </p>
                </div>
              )}
              {status === "streaming" && (
                <Message content="..." isLoading={true} isUserMessage={false} />
              )}
              {error && (
                <Message content={error.message} isUserMessage={false} />
              )}
            </div>
          </div>
        </div>
        {/* Input container */}
        <div className="flex-shrink-0 bg-gray-100 rounded-b-3xl">
          <PlaceholdersAndVanishInput
            placeholders={placeholders}
            input={input}
            setInput={setInput}
            handleSubmit={(event) => {
              // Use 'event' to prevent default if it exists
              event?.preventDefault?.();

              // Your custom logic
              sendMessage({ text: input });
              setInput("");
            }}
            status={status}
            handleStop={stop}
          />
        </div>
      </div>
    </div>
  );
};
