"use client";

import { Message } from "@/types/chat";
import MessageBubble from "./MessageBubble";

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
}

export default function MessageList({ messages, isLoading }: MessageListProps) {
  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-4">
        <img 
          src="/logo.png" 
          alt="Logo" 
          className="w-32 h-32 object-contain mb-4"
        />
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
          ¿En qué puedo ayudarte?
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-md">
          Escribe tu mensaje abajo para comenzar una conversación
        </p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto px-4 py-6">
      <div className="max-w-3xl mx-auto space-y-8">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        {isLoading && (
          <div className="flex gap-3">
            <img 
              src="/logo.png" 
              alt="Logo" 
              className="w-16 h-16 object-contain flex-shrink-0"
            />
            <div className="flex-1 bg-white dark:bg-gray-800 rounded-2xl px-4 py-3 shadow-sm">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
