import React, { useState, useRef } from "react";

interface ChatInputProps {
  onSend: (message: string) => void;
  message: string;
  setMessage: (message: string) => void;
}

export default function ChatInput({
  onSend,
  message,
  setMessage,
}: ChatInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const recognitionRef = useRef<any>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(inputValue);
    if (!inputValue.trim()) return;
    onSend(inputValue);
    setInputValue("");
  };

  const startListening = () => {
    console.log("Starting speech recognition...");
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    recognition.continuous = false;
    recognition.lang = "en-US";
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputValue(inputValue + " " +transcript);
      console.log("Transcribed text:", transcript);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 bg-[#343541] flex items-center gap-3 justify-center"
    >
      <input
        className="w-full max-w-3xl rounded-md bg-[#40414F] p-3 text-white outline-none"
        value={inputValue}
        onChange={(e) =>{setInputValue(e.target.value)}}
        placeholder="Send a message..."
      />

      {/* Mic Button */}
      <button
        type="button"
        onClick={() => {isListening?setIsListening(false):startListening()}}
        className={`p-3 rounded-full  text-white hover:bg-[#565869] ${
          isListening ? "bg-red-600 !important" : "bg-[#40414F]"
        }`}
        title="Speak"
      >
        🎤
      </button>
    </form>
  );
}
