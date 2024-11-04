
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
      className="custom-scrollbar pb-3 flex flex-col justify-end h-[60vh] max-h-[550px] overflow-y-auto"
    >
      {messages.length ? (
        // Map over messages and display each one
        messages.map((message, i) => (
          <Message
            key={i}
            content={message.content}
            isUserMessage={message.role === "user"}
          />
        ))
      ) : (
        // Display this content when there are no messages
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
