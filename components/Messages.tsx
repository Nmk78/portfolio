import { type UIMessage as TMessage } from "@ai-sdk/react";
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
        <div className="flex flex-col-reverse">
          {" "}
          {/* Optional: Use flex-col-reverse to show newest messages at the bottom */}
          {messages.map((message, i) => (
            <Message
              key={message.id || i} // 💡 Use message.id for a stable key if available, otherwise use index
              // ✅ FIX: Map over the parts to get the text, then JOIN them into one string.
              content={
                message.parts
                  .filter((part) => part.type === "text") // Only process text parts
                  .map((part) => part.text)
                  .join("") // Concatenate all parts into a single string
              }
              isUserMessage={message.role === "user"}
            />
          ))}
        </div>
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
