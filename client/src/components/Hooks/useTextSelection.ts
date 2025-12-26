// useTextSelection.ts
import { useEffect, useState,useRef } from "react";

export function useTextSelection() {
  const [selectedText, setSelectedText] = useState("");
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);
  const contextMenuRef = useRef<HTMLDivElement | null>(null);
  
  /// Function to copy text to clipboard
  const copyToClipboard = async (text: string, parent: HTMLElement,setVisible: React.Dispatch<React.SetStateAction<boolean>>) => {
    try {
      await navigator.clipboard.writeText(text)
      const textElement = parent.querySelector('#Innertext');
      const iconElement = parent.querySelector('#button');
      // setVisible(true);
      if (textElement && iconElement) {
        const originalText = textElement.textContent;
        textElement.textContent = "Copied!";
        const originalIcon = iconElement.textContent;
        iconElement.textContent = "✅";
        setTimeout(() => {
          textElement.textContent = originalText || "";
          iconElement.textContent = originalIcon || "";
          setVisible(false);
        }, 1500);
      }
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {

    const handleContextMenu = (e: MouseEvent) => {
      const selection = window.getSelection()?.toString().trim();

      if (selection) {
        e.preventDefault(); // disable default menu
        setSelectedText(selection);
        setPosition({ x: e.clientX, y: e.clientY });
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    /// Closing context menu on click anywhere
    const handleClick = () => setVisible(false);
    
    /// contextmenu is an mouse event that is triggered on right click or long press on mobile
    document.addEventListener("contextmenu", handleContextMenu);

    document.addEventListener("click", (e) => {
      /// Using ref to get contextmenu element 
      const cont = contextMenuRef.current;
      // Checking if clicked outside of context menu
      if (cont && !cont.contains(e.target as Node)) {
        handleClick();
      }
    });

    return () => {
      /// Removing event listeners on unmount
      document.removeEventListener("contextmenu", handleContextMenu);
      // document.removeEventListener("click", handleClick);
      
    };
  }, []);

  return { selectedText, position, visible, setVisible ,contextMenuRef, copyToClipboard };
}
