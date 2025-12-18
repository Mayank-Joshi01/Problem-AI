import React, { useState } from "react";

interface ChatInputProps {
  onSend: (message: string) => void;
  message: string;
  setMessage: (message: string) => void;
}

export default function ChatInput({ onSend , message ,setMessage}: ChatInputProps) {

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    onSend(message);
    setInputValue("");
  };
  const [inputValue, setInputValue] = useState("");


  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 bg-[#343541] flex items-center justify-center"
    >
      <input
        className="w-full max-w-3xl rounded-md bg-[#40414F] p-3 text-white outline-none"
        value={inputValue}
        onChange={(e) => {setMessage(e.target.value);setInputValue(e.target.value);}}
        placeholder="Send a message..."
      />
    </form>
  );
}
