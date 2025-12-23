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
  className="
    p-4
    flex items-center gap-3 justify-center

    bg-white
    dark:bg-[#212121]

    border-t border-gray-200
    dark:border-gray-700

    transition-colors duration-300
  "
>
  {/* Text Input */}
  <input
    className="
      w-full max-w-3xl
      rounded-lg px-4 py-3 text-sm

      bg-gray-100 text-gray-900
      placeholder-gray-500
      outline-none

      focus:ring-2 focus:ring-blue-500

      dark:bg-[#303030]
      dark:text-gray-100
      dark:placeholder-gray-400

      transition-colors
    "
    value={inputValue}
    onChange={(e) => setInputValue(e.target.value)}
    placeholder="Send a message..."
  />

  {/* Mic Button */}
  <button
    type="button"
    onClick={() =>
      isListening ? setIsListening(false) : startListening()
    }
    className={`
      h-11 w-11
      flex items-center justify-center
      rounded-full
      text-lg

      transition-all duration-300

      ${
        isListening
          ? "bg-red-500 text-white scale-110 shadow-lg animate-pulse"
          : `
            bg-gray-200 text-gray-800
            hover:bg-gray-300

            dark:bg-[#40414F]
            dark:text-gray-100
            dark:hover:bg-[#565869]
          `
      }
    `}
    title="Speak"
  >
    🎤
  </button>
</form>

  );
}
