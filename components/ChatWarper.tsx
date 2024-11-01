"use client";

import { Message, useChat } from "ai/react";
import { useState } from "react";
import { Messages } from "./Messages";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
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
    "What's the first rule of Fight Club?",
    "Who is Tyler Durden?",
    "Where is Andrew Laeddis Hiding?",
    "Write a Javascript method to reverse a string",
    "How to assemble your own PC?",
  ];

  return (
    <div className="w-screen h-full bg-red-100">
      <div className="w-1/2 max-w-xl mx-auto max-h-[80vh] h-full rounded-b-3xl min-h-[20vh] bg-transparent bg-gray-100 flex flex-col divide-y ">
        {/* Messages container with fade-away effect */}
        <div className="flex-1 h-[80%] bg-gray-100 overflow-hidden relative">
          <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-white via-gray-100/50 to-transparent pointer-events-none z-10" />
          <div className=" h-full overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
            <Messages messages={messages} />
          </div>
        </div>

        {/* Input and placeholders container */}
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
