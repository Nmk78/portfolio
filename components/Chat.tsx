
import { cookies } from "next/headers"; // For server-side cookie handling
import { ChatWrapper } from "./ChatWarper";

export default async function Chat() {
  // Get session ID from cookies (server-side)
  let storedSessionId = cookies().get("chatSessionId")?.value;

  // If no session ID, create a new one
  if (!storedSessionId) {
    storedSessionId = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  return <ChatWrapper sessionId={storedSessionId} />;
}
