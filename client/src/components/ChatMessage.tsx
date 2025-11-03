import React from "react";

interface ChatMessageProps {
  message: string;
  isUser?: boolean;
}

export default function ChatMessage({ message, isUser }: ChatMessageProps) {
  return (
    <div className={`w-full py-4 px-6 ${isUser ? "bg-[#444654]" : "bg-[#343541]" }`}>
      <div className="max-w-3xl mx-auto flex">
        <div className="mr-4">
          {isUser ? "🧑" : "🤖"}
        </div>
        <div className="whitespace-pre-wrap">{message}</div>
      </div>
    </div>
  );
}
