// // import { ChatWrapper } from "./ChatWarper";
// // import { useEffect, useState } from "react";
// // import Cookies from "js-cookie"; // You may need to install `js-cookie`
// // import { ragChat } from "@/lib/rag-chat";

// // export default async function Chat() {

// //   const [sessionId, setSessionId] = useState<string | null>(null);

// //   useEffect(() => {
// //     // Get session ID from cookies
// //     let storedSessionId = Cookies.get("chatSessionId");

// //     // If no session ID, create a new one
// //     if (!storedSessionId) {
// //       storedSessionId = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
// //       Cookies.set("chatSessionId", storedSessionId, { expires: 7 }); // Cookie expires in 7 days
// //     }

// //     setSessionId(storedSessionId);
// //     const initialMessages = await ragChat.history.getMessages({ amount: 10, sessionId });

// //   }, []);

// //   return (
// //     <div className="flex flex-col items-center justify-center min-h-50vh p-4 bg-gray-600">
// //       <ChatWrapper sessionId={sessionId} initialMessages={initialMessages} />
// //     </div>
// //   );
// // }

// import { useEffect, useState } from "react";
// import Cookies from "js-cookie"; // Ensure `js-cookie` is installed
// import { ragChat } from "@/lib/rag-chat";
// import { ChatWrapper } from "./ChatWarper";

// export default function Chat() {
//   const [sessionId, setSessionId] = useState<string | null>(null);
//   const [initialMessages, setInitialMessages] = useState<any[]>([]); // Store the initial messages in a state

//   useEffect(() => {
//     const fetchChatData = async () => {
//       // Get session ID from cookies
//       let storedSessionId = Cookies.get("chatSessionId");

//       // If no session ID, create a new one
//       if (!storedSessionId) {
//         storedSessionId = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
//         Cookies.set("chatSessionId", storedSessionId, { expires: 7 }); // Cookie expires in 7 days
//       }

//       setSessionId(storedSessionId);

//       if (storedSessionId) {
//         // Fetch the chat history using the session ID
//         const messages = await ragChat.history.getMessages({
//           amount: 10,
//           sessionId: storedSessionId,
//         });
//         setInitialMessages(messages); // Set fetched messages into state
//       }
//     };

//     fetchChatData(); // Call the async function
//   }, []);

//   return (
//     <div className="flex flex-col items-center justify-center min-h-50vh p-4 bg-gray-600">
//       {/* Pass sessionId and initialMessages as props */}
//       <ChatWrapper sessionId={sessionId} initialMessages={initialMessages} />
//     </div>
//   );
// }
// components/Chat.tsx (Server Component)
import { ragChat } from "@/lib/rag-chat";
import { cookies } from "next/headers"; // For server-side cookie handling
import { ChatWrapper } from "./ChatWarper";

export default async function Chat() {
  // Get session ID from cookies (server-side)
  let storedSessionId = cookies().get("chatSessionId")?.value;

  // If no session ID, create a new one
  if (!storedSessionId) {
    storedSessionId = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    cookies().set("chatSessionId", storedSessionId, { maxAge: 7 * 24 * 60 * 60 }); // Cookie expires in 7 days
  }

  // Fetch initial messages from the server-side only
  const initialMessages = await ragChat.history.getMessages({ 
    amount: 10, 
    sessionId: storedSessionId 
  });

  // Render client component with the data
  return <ChatWrapper sessionId={storedSessionId} initialMessages={initialMessages} />;
}
