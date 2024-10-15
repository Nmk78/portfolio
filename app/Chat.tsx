// pages/index.tsx
"use client"
import { useState } from 'react';
import axios from 'axios';

// types/chat.ts
export interface Message {
    role: 'user' | 'assistant';
    content: string;
  }

  
export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');

  const sendMessage = async () => {
    if (!input) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    try {
      const response = await axios.post('/api/chat', { message: input });
      const botMessage: Message = { role: 'assistant', content: response.data.content };
      setMessages((prevMessages) => [...prevMessages, userMessage, botMessage]);
    } catch (error) {
      console.error(error);
    }

    setInput('');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-600">
      <div className="bg-gray-700 shadow-lg rounded-lg p-6 w-full max-w-lg">
        <div className="h-96 overflow-y-auto mb-4">
          {messages.map((msg, index) => (
            <div key={index} className={`my-2 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
              <span className={`${msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'} px-4 py-2 rounded-lg`}>
                {msg.content}
              </span>
            </div>
          ))}
        </div>
        <div className="flex">
          <input
            type="text"
            className="flex-grow border border-gray-300 bg-gray-800 rounded-lg p-2 mr-2"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
          />
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
            onClick={sendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
