// TranslationPopup.tsx
import { useState,useEffect, } from "react";

interface Props {
  original: string;
  setShowPopup: (value: boolean) => void;
}

export function TranslationPopup({ original, setShowPopup }: Props) {

  /// It represents the translated text
  const [translation, setTranslation] = useState("")

  /// Function to fetch translation from external API

  async function translateText(text: string) {
    /// Using MyMemory Translated API for demonstration
    const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|hi`);
    const data = await res.json();
    return data.matches[0]?.translation || "Translation not found"; 
  };

  /// Handle translation on component mount
  const handleTranslate = async () => {
    const translated = await translateText(original);
    setTranslation(`${translated} , translation 2 , translation 3` );
  };

//// using useEffect to call handleTranslate when original text changes
/// using useEffect to call handleTranslate , since when everytime popup opens it fetches translation again
useEffect(() => {
  handleTranslate();
}, [original]);

  return (
    <div className="fixed top-4 right-4 w-80 bg-[#343541] text-white p-4 rounded-lg shadow-xl z-50">
      <button
        className="absolute top-2 right-2 text-gray-400"
        onClick={() => setShowPopup(false)}
      >
        ✕
      </button>

      <div className="text-sm text-gray-400">Original</div>
      <div className="mb-2">{original}</div>

      <div className="text-sm text-gray-400">Translation</div>
      <div className="font-semibold">{translation}</div>
    </div>
  );
}
