import { ChatWrapper } from "./ChatWarper";
import { useEffect, useState } from "react";
import Cookies from "js-cookie"; // You may need to install `js-cookie`

export default function Chat() {

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [initialMessages, setInitialMessages] = useState();

  useEffect(() => {
    // Get session ID from cookies
    let storedSessionId = Cookies.get("chatSessionId");

    // If no session ID, create a new one
    if (!storedSessionId) {
      storedSessionId = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      Cookies.set("chatSessionId", storedSessionId, { expires: 7 }); // Cookie expires in 7 days
    }

    setSessionId(storedSessionId);

    // Fetch initial messages using the sessionId
    const fetchMessages = async () => {
      const response = await fetch(`/api/chat?sessionId=${storedSessionId}`);
      const data = await response.json();
      setInitialMessages(data);
    };
    
    fetchMessages();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-50vh p-4 bg-gray-600">
      <ChatWrapper sessionId={sessionId} initialMessages={initialMessages} />
    </div>
  );
}
