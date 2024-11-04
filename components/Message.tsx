import { cn } from "@/lib/utils";
import { Bot, User } from "lucide-react";

interface MessageProps {
  content: string;
  isUserMessage: boolean;
}

export const Message = ({ content, isUserMessage }: MessageProps) => {
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
          <span className="mb-1 text-xs font-medium opacity-70">
            {isUserMessage ? "You" : "Me"}
          </span>
          <p className="text-sm">{content}</p>
        </div>
      </div>
    </div>
    // <div
    //   className={cn("flex", {
    //     "justify-end": isUserMessage, // Align user messages to the right
    //     "justify-start": !isUserMessage, // Align bot messages to the left
    //   })}
    // >
    //   <div
    //     className={cn("p-4 rounded-lg max-w-md flex items-start gap-2", {
    //       "bg-zinc-800 text-white": isUserMessage, // User message styling
    //       "bg-zinc-900/25 text-gray-100": !isUserMessage, // Bot message styling
    //     })}
    //   >
    //     <div
    //       className={cn(
    //         "shrink-0 aspect-square rounded-full border border-zinc-700 flex justify-center items-center",
    //         {
    //           "bg-blue-950 border-blue-700 text-zinc-200": isUserMessage,
    //           "bg-zinc-900 text-white": !isUserMessage,
    //         }
    //       )}
    //     >
    //       {isUserMessage ? (
    //         <User className="size-4" />
    //       ) : (
    //         <Bot className="size-4" />
    //       )}
    //     </div>

    //     <div className="flex flex-col ml-2">
    //       <span className="text-sm font-semibold">
    //         {isUserMessage ? "You" : "Bot"}
    //       </span>
    //       <p className="text-sm">{content}</p>
    //     </div>
    //   </div>
    // </div>
  );
};
