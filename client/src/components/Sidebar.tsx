import React from "react";

interface Chat {
  id: string;
  title: string;
}

interface SidebarProps {
  chats: Chat[];
  activeChatId: string | null;
  onSelectChat: (id: string) => void;
  onNewChat: () => void;
}

export default function Sidebar({
  chats,
  activeChatId,
  onSelectChat,
  onNewChat,
}: SidebarProps) {
  return (
    <div className="w-64 bg-[#202123] flex flex-col p-3">
        <h1 className="text-lg font-bold text-white mb-[25px]"><img src="/Logo.png" alt="" width={30}/></h1>
      <button
        onClick={onNewChat}
        className="bg-[#343541] rounded-md py-2 px-3 mb-4 hover:bg-[#3e3f4b] text-left text-white"
      >
        + New Chat
      </button>

      <div className="flex-1 overflow-y-auto">
        {chats.length === 0 ? (
          <p className="text-gray-400 text-sm">No chats yet</p>
        ) : (
          chats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => onSelectChat(chat.id)}
              className={`w-full text-left py-2 px-3 rounded-md mb-2 text-sm truncate ${
                activeChatId === chat.id
                  ? "bg-[#343541] text-white"
                  : "text-gray-300 hover:bg-[#2a2b32]"
              }`}
            >
              {chat.title}
            </button>
          ))
        )}
      </div>
    </div>
  );
}
