// TranslateMenu.tsx
interface Props {
  x: number;
  y: number;
  onTranslate: () => void;
}

export function TranslateMenu({ x, y, onTranslate }: Props) {
  return (
    <div
      style={{ top: y, left: x }}
      className="fixed z-50 bg-[#2b2d31] text-white rounded-md shadow-lg px-3 py-2 cursor-pointer"
      onClick={onTranslate}
    >
      🌐 Translate
    </div>
  );
}
