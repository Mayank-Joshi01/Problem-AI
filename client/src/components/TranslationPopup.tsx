// TranslationPopup.tsx
interface Props {
  original: string;
  translated: string;
  onClose: () => void;
}

export function TranslationPopup({ original, translated, onClose }: Props) {
  return (
    <div className="fixed top-4 right-4 w-80 bg-[#343541] text-white p-4 rounded-lg shadow-xl z-50">
      <button
        className="absolute top-2 right-2 text-gray-400"
        onClick={onClose}
      >
        ✕
      </button>

      <div className="text-sm text-gray-400">Original</div>
      <div className="mb-2">{original}</div>

      <div className="text-sm text-gray-400">Translation</div>
      <div className="font-semibold">{translated}</div>
    </div>
  );
}
