// import { cn } from "@/lib/utils";
// import { Bot, Ellipsis, User } from "lucide-react";

// interface MessageProps {
//   content: string;
//   isUserMessage: boolean;
//   isLoading?: boolean;
// }

// export const Message = ({ content, isUserMessage, isLoading }: MessageProps) => {
//   if(content == null || content == "")return;
//   return (
//     <div
//       className={cn("flex items-end mb-4 mx-1", {
//         "justify-end": isUserMessage,
//         "justify-start": !isUserMessage,
//       })}
//     >
//       <div
//         className={cn("flex max-w-md rounded-2xl px-4 py-3 shadow-md", {
//           "bg-red-800 text-white": isUserMessage,
//           "bg-red-900 text-gray-100": !isUserMessage,
//           "flex-row-reverse": isUserMessage,
//           "flex-row": !isUserMessage,
//         })}
//       >
//         <div
//           className={cn(
//             "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
//             // {
//             //   "bg-blue-700": isUserMessage,
//             //   "bg-zinc-700": !isUserMessage,
//             // }
//           )}
//         >
//           {isUserMessage ? (
//             <User className="h-5 w-5 text-white" aria-hidden="true" />
//           ) : (
//             <Bot className="h-5 w-5 text-white" aria-hidden="true" />
//           )}
//         </div>

//         <div className={cn("flex flex-col", {
//           "mr-3 items-end": isUserMessage,
//           "ml-3 items-start": !isUserMessage,
//         })}>
//           <span className="my-1 text-xs font-medium opacity-70">
//             {/* {isUserMessage ? "You" : "Bot"} */}
//           </span>
//         {isLoading ? <Ellipsis className="h-7 w-7 animate-pulse text-white" aria-hidden="true" /> : <p className="text-sm">{content}</p>  }
//         </div>
//       </div>
//     </div>

//   );
// };

"use client";

import { cn } from "@/lib/utils";
import { Bot, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MessageProps {
  content: string;
  isUserMessage?: boolean;
  isLoading?: boolean;
}

export function Message({
  content,
  isUserMessage = false,
  isLoading = false,
}: MessageProps) {
  return (
    <div
      className={cn(
        "flex w-full mb-4 px-4",
        isUserMessage ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[80%] rounded-3xl flex px-4  items-start",
          isUserMessage
            ? "bg-red-700 text-white flex-row-reverse py-1"
            : "py-2 flex-row bg-gray-300 text-gray-900 border border-gray-200"
        )}
      >
        {isUserMessage ? (  
          <User className="size-6 text-white" aria-hidden="true" />
        ) : (
          <Bot className="size-6 text-white" aria-hidden="true" />
        )}
        {isLoading ? (
          <div className="flex ml-5 text-white items-center gap-2">
            <span>...</span>
          </div>
        ) : (
          <div
            className={`text-sm  leading-relaxed prose prose-sm max-w-none prose-p:my-2 prose-headings:my-3 prose-ul:my-2 prose-ol:my-2 prose-li:my-1 prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-100 prose-pre:p-3 prose-pre:rounded-lg ${
              isUserMessage ? "mr-5 text-white" : "ml-5 text-black"
            }`}
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
