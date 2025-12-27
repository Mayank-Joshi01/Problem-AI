import React, { useRef } from "react";

interface ChatMessageProps {
  message: string;
  isUser?: boolean;
}

export default function ChatMessage({ message, isUser }: ChatMessageProps) {
  const SpeakingRef = useRef<boolean>(false);

  /* ================= COPY ================= */
  const CopyMessage = (
    e: React.MouseEvent<HTMLSpanElement>,
    text: string
  ) => {
    navigator.clipboard.writeText(text);

    const icon = e.currentTarget;
    const original = icon.innerHTML;

    icon.title = "Copied!";
    icon.classList.add("text-green-500");
    icon.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" fill="none"
        viewBox="0 0 24 24" stroke-width="1.5" stroke="green" class="size-5">
        <path stroke-linecap="round" stroke-linejoin="round"
          d="M9 12.75 11.25 15 15 9.75M21 12
          a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    `;

    setTimeout(() => {
      icon.title = "Copy";
      icon.innerHTML = original;
      icon.classList.remove("text-green-500");
    }, 1500);
  };

  /* ================= SPEAK ================= */
  const StopSpeaking = () => {
    window.speechSynthesis.cancel();
    SpeakingRef.current = false;
  };

  const SpeakMessage = (
    e: React.MouseEvent<HTMLSpanElement>,
    text: string
  ) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";

    const icon = e.currentTarget;
    const original = icon.innerHTML;

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);

    utterance.onstart = () => {
      icon.title = "Speaking...";
      icon.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" fill="none"
          viewBox="0 0 24 24" stroke-width="1.5" stroke="red" class="size-5">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M14.25 9v6m-4.5 0V9M21 12
            a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      `;
      SpeakingRef.current = true;
    };

    utterance.onend = utterance.onerror = () => {
      icon.title = "Listen";
      icon.innerHTML = original;
      SpeakingRef.current = false;
    };
  };

  /* ================= UI ================= */
  return (
    <div className="w-full py-6">
      {/* USER MESSAGE (RIGHT) */}
      {isUser && (

          <div className="w-full flex justify-end  pr-10">
          <div
            className="
              max-w-xl rounded-2xl px-4 py-3 text-sm
             dark:bg-[#303030] dark:text-white shadow-md
             bg-[#f4f4f4] text-gray-900
              whitespace-pre-wrap text-[16px]
            "
          >
            {message}
          </div>
          </div>
        
      )}

      {/* BOT MESSAGE (CENTER – ChatGPT STYLE) */}
      {!isUser && (
        <div className="px-4">
          <div className="max-w-3xl mx-auto">
            <div
              className="
                text-sm leading-relaxed
                text-gray-900 dark:text-gray-100
                whitespace-pre-wrap text-[16px]
              "
            >
              {message}
            </div>

            {/* ACTIONS */}
            <div className="mt-3 flex gap-3">
              <span
                className="
                  cursor-pointer text-gray-500 hover:text-gray-900
                  dark:hover:text-white transition
                "
                title="Copy"
                onClick={(e) => CopyMessage(e, message)}
              >
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="size-5">
  <path d="M7.5 3.375c0-1.036.84-1.875 1.875-1.875h.375a3.75 3.75 0 0 1 3.75 3.75v1.875C13.5 8.161 14.34 9 15.375 9h1.875A3.75 3.75 0 0 1 21 12.75v3.375C21 17.16 20.16 18 19.125 18h-9.75A1.875 1.875 0 0 1 7.5 16.125V3.375Z" />
  <path d="M15 5.25a5.23 5.23 0 0 0-1.279-3.434 9.768 9.768 0 0 1 6.963 6.963A5.23 5.23 0 0 0 17.25 7.5h-1.875A.375.375 0 0 1 15 7.125V5.25ZM4.875 6H6v10.125A3.375 3.375 0 0 0 9.375 19.5H16.5v1.125c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 0 1 3 20.625V7.875C3 6.839 3.84 6 4.875 6Z" />
</svg>



</span>

              <span
                className="
                  cursor-pointer text-gray-500 hover:text-gray-900
                  dark:hover:text-white transition
                "
                title="Listen"
                onClick={(e) =>
                  SpeakingRef.current
                    ? StopSpeaking()
                    : SpeakMessage(e, message)
                }
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                  viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                  className="size-5">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M19.114 5.636a9 9 0 0 1
                    0 12.728M16.463 8.288a5.25
                    5.25 0 0 1 0 7.424M6.75
                    8.25l4.72-4.72a.75.75
                    0 0 1 1.28.53v15.88a.75.75
                    0 0 1-1.28.53l-4.72-4.72H4.51" />
                </svg>
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
