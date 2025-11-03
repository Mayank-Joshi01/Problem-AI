import React, { useState } from "react";

interface ChatInputProps {
  onSend: (message: string) => void;
}

export default function ChatInput({ onSend }: ChatInputProps) {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    onSend(message);
    setMessage("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 bg-[#343541] flex items-center justify-center"
    >
      <input
        className="w-full max-w-3xl rounded-md bg-[#40414F] p-3 text-white outline-none"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Send a message..."
      />
    </form>
  );
}
