"use client";

import { Message, useChat } from "ai/react";
import { useState } from "react";
import { Messages } from "./Messages";
import { PlaceholdersAndVanishInput } from "./ui/placeholders-and-vanish-input";

export const ChatWrapper = ({
  sessionId,
  initialMessages,
}: {
  sessionId: string | null;
  initialMessages: Message[] | undefined;
}) => {
  const { messages, handleInputChange, handleSubmit, input, setInput } = useChat({
    api: "/api/chat",
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
    <div className="relative min-h-full h-[50vh] bg-zinc-900 flex divide-y divide-zinc-700 flex-col justify-between gap-2">
      <div className="flex-1 h-[50vh] text-black bg-zinc-800 justify-between flex flex-col">
        <Messages messages={messages} />
      </div>

      <PlaceholdersAndVanishInput
            placeholders={placeholders}
            onChange={handleInputChange}
            onSubmit={handleSubmit}
          />
    </div>
  );
};