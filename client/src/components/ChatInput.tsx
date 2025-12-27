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
  const [VoiceChat,setViceChat]=useState(false);
  const recognitionRef = useRef<any>(null);

  const starVoiceChat=()=>{
    setViceChat(true);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    setMessage(inputValue);
    onSend(inputValue);
    setInputValue("");
  };

  const startListening = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition not supported");
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    recognition.lang = "en-US";
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputValue((prev) => prev + " " + transcript);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="
        p-4 flex items-center gap-3 justify-center
        bg-white dark:bg-[#212121]
        border-t border-gray-200 dark:border-gray-700
      "
    >
      {/* Input wrapper */}
      <div className="relative w-full max-w-3xl">
        <input
          className="
            w-full rounded-lg px-4 py-3 pr-24 text-sm
            bg-gray-100 text-gray-900
            placeholder-gray-500 outline-none
            focus:ring-2 focus:ring-blue-500
            dark:bg-[#303030]
            dark:text-gray-100
            dark:placeholder-gray-400
          "
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Send a message..."
        />

        {/* Icons inside input */}
        <div className="absolute inset-y-0 right-2 flex items-center gap-2">
          {/* Mic inside input */}
          <button
            type="button"
            onClick={startListening}
            className={`text-lg ${
              isListening ? "text-red-500 animate-pulse" : "opacity-70"
            } text-gray-500 dark:hover:text-gray-300 hover:text-gray-700` }
            title="Speak"
      
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
</svg>

          </button>

          {/* Send */}
          {inputValue.trim() &&
          <button
            type="submit"
            className="text-blue-600 dark:text-blue-400 text-lg"
            title="Send"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
  <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
</svg>

          </button>
          }
        </div>
      </div>

    {/* Voice Chat Button */}
<div className="relative group inline-block">
  <button
    type="button"
    onClick={starVoiceChat}
    className="
      h-11 w-11 rounded-full
      flex items-center justify-center
      bg-gray-200 hover:bg-gray-300
      dark:bg-gray-700 dark:hover:bg-gray-600
      scale-100
      hover:scale-115
      transition-all duration-700
      transition-scale
     dark:text-white
    "
    aria-label="Voice Chat Mode"
  >
    <svg xmlns="http://www.w3.org/2000/svg" className="size-6" fill='currentColor' viewBox="0 0 24 24"><path d="M1 10v4a1 1 0 0 0 2 0v-4a1 1 0 0 0-2 0zM6 6v12a1 1 0 0 0 2 0V6a1 1 0 0 0-2 0zM21 10v4a1 1 0 0 0 2 0v-4a1 1 0 0 0-2 0zM16 6v12a1 1 0 0 0 2 0V6a1 1 0 0 0-2 0zM11 2v20a1 1 0 0 0 2 0V2a1 1 0 0 0-2 0z"/></svg>
  </button>

  {/* Tooltip */}
  <div
    className="
      pointer-events-none
      absolute bottom-full left-1/2 -translate-x-1/2 mb-2
      hidden group-hover:flex
      flex-col items-center
      z-50
    "
  >
    <span
      className="
        text-[11px] font-medium
        bg-[#2b2d31] text-white
        px-2 py-1 rounded-md
        shadow-lg
        whitespace-nowrap
        animate-fade-in
      "
    >
      Voice Chat Mode
    </span>

    {/* Arrow */}
    <span
      className="
        w-2 h-2
        bg-[#2b2d31]
        rotate-45
        -mt-1
      "
    />
  </div>
</div>

    </form>
  );
}
