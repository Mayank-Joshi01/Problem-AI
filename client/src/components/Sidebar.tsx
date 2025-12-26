// src/components/Sidebar.tsx
import React from "react";
import { useState } from "react";

interface ChatSummary {
  id: string;
  title: string;
  updatedAt?: string;
}

interface SidebarProps {
  chats: ChatSummary[];
  activeChatId: string | null;
  onSelectChat: (id: string) => void;
  onNewChat: () => void;
  onDeleteChat: (id: string) => void;
}

export default function Sidebar({
  chats,
  activeChatId,
  onSelectChat,
  onNewChat,
  onDeleteChat,
}: SidebarProps) {

  const [isOpen, setIsOpen] = useState(false);

  return (
   <>
  {/* Toggle Button (Mobile Only) */}
  <button
    onClick={() => setIsOpen(!isOpen)}
    className="
      md:hidden fixed top-3 left-5 z-50
      px-3 py-1 rounded-md text-lg
      bg-white text-gray-900
      dark:bg-[#202123] dark:text-white
      shadow-md
      transition-colors
    "
  >
    ☰
  </button>

  {/* Overlay (Mobile Only) */}
  {isOpen && (
    <div
      onClick={() => setIsOpen(false)}
      className="
        md:hidden fixed inset-0 z-40
        bg-black/20 dark:bg-black/40
        backdrop-blur-md
        transition-colors
      "
    />
  )}

  {/* Sidebar */}
  <div
    className={`
      fixed md:static top-0 left-0 z-50
      h-full w-64
      flex flex-col p-4

      bg-white text-gray-900
      dark:bg-[#202123] dark:text-gray-100

      border-r border-gray-200 dark:border-gray-700

      transform transition-transform duration-300
      ${isOpen ? "translate-x-0" : "-translate-x-full"}
      md:translate-x-0
    `}
  >
    {/* Logo */}
    <h1 className="text-lg font-bold mb-6 flex items-center justify-center gap-2">
      <img src="/Logo.png" alt="Logo" width={30} height={40} className=" hidden dark:block"/>
      <img src="/BLogo.png" alt="Logo" width={30} height={40} className="dark:hidden"/>
      <span className="hidden md:inline">ProblemAI</span>
    </h1>

    {/* New Chat */}
    <button
      onClick={onNewChat}
      className="
        mb-4 w-full text-left
        rounded-md px-3 py-2 text-sm font-medium

        bg-gray-100 hover:bg-gray-200
        dark:bg-[#343541] dark:hover:bg-[#3e3f4b]

        transition-colors
      "
    >
      + New Chat
    </button>
    {/* Chat List */}
    <div className="flex-1 
    space-y-2
      overflow-y-auto
      [&::-webkit-scrollbar]:hidden
      [-ms-overflow-style:none]
      [scrollbar-width:none]
    "> <div>Your Chats</div>
      {chats.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          No chats yet
        </p>
      ) : (
        chats.map((chat) => (
          <div key={chat.id} className="flex items-center gap-2">
            <button
              onClick={() => onSelectChat(chat.id)}
              className={`
                flex-1 truncate text-left text-sm
                rounded-md px-3 py-2

                transition-colors

                ${
                  activeChatId === chat.id
                    ? "bg-gray-200 dark:bg-[#343541]"
                    : "hover:bg-gray-100 dark:hover:bg-[#2a2b32]"
                }
              `}
            >
              {chat.title}
            </button>

            <button
              onClick={() => onDeleteChat(chat.id)}
              className="
                text-red-500 hover:text-red-600
                dark:text-red-400 dark:hover:text-red-300
                transition-colors
              "
              title="Delete chat"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
</svg>
            </button>
          </div>
        ))
      )}
    </div>
  </div>
</>

  );
}
