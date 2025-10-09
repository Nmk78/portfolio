import { cn } from "@/lib/utils";
import { Bot, Ellipsis, User } from "lucide-react";

interface MessageProps {
  content: string;
  isUserMessage: boolean;
  isLoading?: boolean;
}

export const Message = ({ content, isUserMessage, isLoading }: MessageProps) => {
  if(content == null || content == "")return;
  return (
    <div
      className={cn("flex items-end mb-4 mx-1", {
        "justify-end": isUserMessage,
        "justify-start": !isUserMessage,
      })}
    >
      <div
        className={cn("flex max-w-md rounded-2xl px-4 py-3 shadow-md", {
          "bg-gray-800 text-white": isUserMessage,
          "bg-zinc-800 text-gray-100": !isUserMessage,
          "flex-row-reverse": isUserMessage,
          "flex-row": !isUserMessage,
        })}
      >
        <div
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
            {
              "bg-blue-700": isUserMessage,
              "bg-zinc-700": !isUserMessage,
            }
          )}
        >
          {isUserMessage ? (
            <User className="h-5 w-5 text-white" aria-hidden="true" />
          ) : (
            <Bot className="h-5 w-5 text-white" aria-hidden="true" />
          )}
        </div>

        <div className={cn("flex flex-col", {
          "mr-3 items-end": isUserMessage,
          "ml-3 items-start": !isUserMessage,
        })}>
          <span className="my-1 text-xs font-medium opacity-70">
            {/* {isUserMessage ? "You" : "Bot"} */}
          </span>
        {isLoading ? <Ellipsis className="h-7 w-7 animate-pulse text-white" aria-hidden="true" /> : <p className="text-sm">{content}</p>  }
        </div>
      </div>
    </div>

  );
};
