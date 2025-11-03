// src/components/Sidebar.tsx
import React from "react";

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
  return (
    <div className="w-64 bg-[#202123] flex flex-col p-3">
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={onNewChat}
          className="bg-[#343541] rounded-md py-2 px-3 hover:bg-[#3e3f4b] text-left text-white"
        >
          + New Chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {chats.length === 0 ? (
          <p className="text-gray-400 text-sm">No chats yet</p>
        ) : (
          chats.map((chat) => (
            <div key={chat.id} className="flex items-center mb-2">
              <button
                onClick={() => onSelectChat(chat.id)}
                className={`flex-1 text-left py-2 px-3 rounded-md text-sm truncate ${
                  activeChatId === chat.id
                    ? "bg-[#343541] text-white"
                    : "text-gray-300 hover:bg-[#2a2b32]"
                }`}
              >
                {chat.title}
              </button>
              <button
                onClick={() => onDeleteChat(chat.id)}
                className="ml-2 text-sm text-red-400 hover:text-red-200"
                title="Delete chat"
              >
                🗑
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
