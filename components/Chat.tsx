
// import { ragChat } from "@/lib/rag-chat";
// import { cookies } from "next/headers"; // For server-side cookie handling
// import { ChatWrapper } from "./ChatWarper";

// export default async function Chat() {
//   // Get session ID from cookies (server-side)
//   let storedSessionId = cookies().get("chatSessionId")?.value;

//   // If no session ID, create a new one
//   if (!storedSessionId) {
//     storedSessionId = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
//     cookies()?.set("chatSessionId", storedSessionId, { maxAge: 7 * 24 * 60 * 60 }); // Cookie expires in 7 days
//   }

//   // Fetch initial messages from the server-side only
//   const initialMessages = await ragChat.history.getMessages({ 
//     amount: 10, 
//     sessionId: storedSessionId 
//   });

//   // Render client component with the data
//   return <ChatWrapper sessionId={storedSessionId} initialMessages={initialMessages} />;
// }


import { ragChat } from "@/lib/rag-chat";
import { cookies } from "next/headers"; // For server-side cookie handling
import { ChatWrapper } from "./ChatWarper";

export default async function Chat() {
  // Get session ID from cookies (server-side)
  let storedSessionId = cookies().get("chatSessionId")?.value;

  // If no session ID, create a new one
  if (!storedSessionId) {
    storedSessionId = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Return the session ID in a way that the client can handle it properly
    // Set cookie logic can go to an API route instead
  }

  // Fetch initial messages from the server-side only
  const initialMessages = await ragChat.history.getMessages({
    amount: 10,
    sessionId: storedSessionId,
  });

  // Ensure initialMessages is a plain object or array
  const messagesToPass = Array.isArray(initialMessages) ? initialMessages : [];

  // Render client component with the plain data
  return <ChatWrapper sessionId={storedSessionId} initialMessages={messagesToPass} />;
}
