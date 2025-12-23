import React from "react";

interface ChatMessageProps {
  message: string;
  isUser?: boolean;
}

export default function ChatMessage({ message, isUser }: ChatMessageProps) {
  return (
<div
  className={`
    w-full py-4 px-6
    transition-colors duration-300

    ${
      isUser
        ? "bg-gray-100 dark:bg-[#444654]"
        : "bg-white dark:bg-[#212121]"
    }
  `}
>
  <div className="max-w-3xl mx-auto flex gap-4">
    {/* Avatar */}
    <div
      className="
        flex h-8 w-8 items-center justify-center
        rounded-full text-sm
        bg-gray-300 text-gray-800
        dark:bg-gray-700 dark:text-gray-100
        flex-shrink-0
      "
    >
      {isUser ? "🧑" : "🤖"}
    </div>

    {/* Message */}
    <div
      className="
        whitespace-pre-wrap leading-relaxed text-sm

        text-gray-900
        dark:text-gray-100
      "
    >
      {message}
    </div>
  </div>
</div>

  );
}
