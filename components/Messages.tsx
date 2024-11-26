import { type Message as TMessage } from "ai/react";
import { MessageSquare } from "lucide-react";
import { Message } from "./Message";
import { useEffect, useRef } from "react";

interface MessagesProps {
  messages: TMessage[];
}

export const Messages = ({ messages }: MessagesProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);


  return (
    <div
      ref={containerRef}
      className="h-full flex flex-col justify-end overflow-y-auto pt-12 scrollbar-thin custom-scrollbar"
      // className="messages-container custom-scrollbar pb-3"
    >
      {messages.length ? (
        messages.map((message, i) => (
          <Message
            key={i}
            content={message.content}
            isUserMessage={message.role === "user"}
          />
        ))
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center gap-2 flex-shrink-0">
          <MessageSquare className="h-8 w-8 text-red-500" />
          <h3 className="font-semibold text-xl text-red-500">Ask about me!</h3>
          <p className="text-zinc-500 text-sm">
            Ask your first question to get started.
          </p>
        </div>
      )}
    </div>
  );
};
