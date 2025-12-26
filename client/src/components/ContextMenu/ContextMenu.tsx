// ContextMenu.tsx
interface Props {
  x: number;
  y: number;
  onTranslate: () => void;
  onSearch: () => void;
  onCopy: (parent: HTMLElement) => void;
  ref: React.Ref<HTMLDivElement>;
}
import Buttons from "./Buttons";

export function ContextMenu({ x, y, onTranslate, onSearch, onCopy, ref }: Props) {
  return (
<div
  style={{ top: y+10, left: x-50 }}
  id="ContextMenu"
  ref={ref}
  className="
    fixed z-50
    flex gap-2
    bg-[#1f2023]
    p-1 rounded-lg
    shadow-xl
    border border-[#3a3b3f]
  "
>
    <Buttons onClick={onTranslate} InnerText={["🌐", "Translate"]} />
    <Buttons onClick={onSearch} InnerText={["🔎", "Search"]} />
    <Buttons onClick={(e) => onCopy(e.currentTarget.parentElement as HTMLElement)} InnerText={["⧉", "Copy"]} />
</div>

  );
}
