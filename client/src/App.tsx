import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import ChatMessage from "./components/ChatMessage";
import ChatInput from "./components/ChatInput";
import Header from "./components/Header";

interface Message {
  text: string;
  isUser: boolean;
}

interface Chat {
  id: string;
  title: string;
  messages: Message[];
}

export default function App() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Load chats from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("chats");
    if (saved) {
      const parsed: Chat[] = JSON.parse(saved);
      setChats(parsed);
      if (parsed.length > 0) setActiveChatId(parsed[0].id);
    }
  }, []);

  // Save chats whenever they change
  useEffect(() => {
    localStorage.setItem("chats", JSON.stringify(chats));
  }, [chats]);

  const activeChat = chats.find((c) => c.id === activeChatId);

  const handleNewChat = () => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: "New Chat",
      messages: [],
    };
    setChats((prev) => [newChat, ...prev]);
    setActiveChatId(newChat.id);
  };

  const handleSend = async (text: string) => {
    if (!activeChat) return;

    const updatedChats = chats.map((chat) =>
      chat.id === activeChatId
        ? {
            ...chat,
            title:
              chat.messages.length === 0
                ? text.slice(0, 20) + "..."
                : chat.title,
            messages: [...chat.messages, { text, isUser: true }],
          }
        : chat
    );
    setChats(updatedChats);
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: text }),
      });

      const data = await res.json();
      const updatedWithReply = updatedChats.map((chat) =>
        chat.id === activeChatId
          ? {
              ...chat,
              messages: [
                ...chat.messages,
                { text: data.response, isUser: false },
              ],
            }
          : chat
      );
      setChats(updatedWithReply);
    } catch (err) {
      console.log("Error:", err);
      const updatedError = updatedChats.map((chat) =>
        chat.id === activeChatId
          ? {
              ...chat,
              messages: [
                ...chat.messages,
                { text: "⚠️ Error connecting to server.", isUser: false },
              ],
            }
          : chat
      );
      setChats(updatedError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar
        chats={chats}
        activeChatId={activeChatId}
        onSelectChat={setActiveChatId}
        onNewChat={handleNewChat}
      />
      <div className="flex flex-col flex-1 bg-[#343541]">
        <Header/>
        <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {activeChat ? (
            <>
              {activeChat.messages.map((msg, idx) => (
                <ChatMessage
                  key={idx}
                  message={msg.text}
                  isUser={msg.isUser}
                />
              ))}
              {loading && <ChatMessage message="Typing..." isUser={false} />}
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              Select or start a chat
            </div>
          )}
        </div>
        {activeChat && <ChatInput onSend={handleSend} />}

      </div>
    </div>
  );
}
