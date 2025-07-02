"use client";

import React from "react";
import { Message, useChat } from "ai/react";
import { Messages } from "./Messages";
import { PlaceholdersAndVanishInput } from "./ui/placeholders-and-vanish-input";

export const ChatWrapper = ({
  sessionId,
  initialMessages,
}: {
  sessionId: string | null;
  initialMessages: Message[] | undefined;
}) => {
  const { messages, handleInputChange, handleSubmit, input, setInput } =
    useChat({
      api: `/api/chat`,
      body: { sessionId },
      initialMessages,
    });

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
          {true && ( // Replace `true` with a `isMaintaining` flag if needed
            <div className="absolute inset-0 z-50 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center">
              <div className="text-lg font-semibold text-gray-700 mb-2">
                🔧 Under Maintenance
              </div>
              <p className="text-sm text-gray-500 text-center max-w-xs">
                Currently working to improve the chat experience. Please check
                back later.
              </p>
            </div>
          )}

          <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-white via-gray-100/50 to-transparent pointer-events-none z-10" />
          <div className="w-full h-full">
            <Messages messages={messages} />
          </div>
        </div>
        {/* Input container */}
        <div className="flex-shrink-0 bg-gray-100 rounded-b-3xl">
          <PlaceholdersAndVanishInput
            placeholders={placeholders}
            input={input}
            setInput={setInput}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
};
