import React, { useState, useEffect, useRef } from "react";
import Sidebar from "./components/Sidebar";
import ChatMessage from "./components/ChatMessage";
import ChatInput from "./components/ChatInput";
import Header from "./components/Header";
import { useTextSelection } from "./components/useTextSelection";
import { TranslateMenu } from "./components/TranslateMenu";
import { TranslationPopup } from "./components/TranslationPopup";
import { listChats, createChat, getChat, sendMessage, deleteChat } from "./api";
import ThemeToggle from "./components/ThemeToggle";

interface Message {
  text: string;
  isUser: boolean;
}

interface Chat {
  id: string;
  title: string;
  messages: Message[];
}

interface ChatSummary {
  id: string;
  title: string;
  updatedAt?: string;
  lastMessage?: Message | null;
}

export default function App() {
  const [chats, setChats] = useState<ChatSummary[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshFlag, setRefreshFlag] = useState(0);
  const [messageStream, setMessageStream] = useState<string>("Typing...");
  const [message, setMessage] = useState("");
  const { selectedText, position, visible, setVisible } = useTextSelection();
  const [translation, setTranslation] = useState("");
  const [showPopup, setShowPopup] = useState(false);


  async function translateText(text: string) {
  const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(
      text
    )}&langpair=en|hi`
  );

  const data = await res.json();
  console.log("Translation API response:", data);
  return data.matches[0]?.translation || "Translation not found";
}

    const handleTranslate = async () => {
      console.log("Translating text:", selectedText);
    setVisible(false);
    const translated = await translateText(selectedText);
    console.log("Translated text:", translated);
    setTranslation(`${translated} , translation 2 , translation 3`);
    setShowPopup(true);
  };

  // const messageStream = useRef<string>("Typing...");

  // Load chat list
  useEffect(() => {
    (async () => {
      try {
        const res = await listChats(); // { chats: [...] }
        setChats(res.chats.map((c: any) => ({
          id: c.id,
          title: c.title,
          updatedAt: c.updatedAt,
          lastMessage: c.lastMessage ? c.lastMessage : null,
        })));
        if (!activeChatId && res.chats.length > 0) {
          setActiveChatId(res.chats[0].id);
        }
      } catch (err) {
        console.error(err);
      }
    })();
  }, [refreshFlag]); // re-fetch when refreshFlag changes



  // Load active chat messages whenever activeChatId changes
  useEffect(() => {
    if (!activeChatId) { setActiveChat(null); return; }
    (async () => {
      try {
        const res = await getChat(activeChatId); // { chat }
        setActiveChat(res.chat);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [activeChatId]);


  const handleNewChat = async () => {
    try {
      const res = await createChat(); // { chatId, title }
      // Refresh chat list and select the new one
      setRefreshFlag((f) => f + 1);
      setActiveChatId(res.chatId);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteChat = async (id: string) => {
    try {
      await deleteChat(id);
      setRefreshFlag((f) => f + 1);
      if (id === activeChatId) setActiveChatId(null);
    } catch (err) {
      console.error(err);
    }
  };

    const handleSend = async (text: string) => {
    if (!activeChatId) return;
    setLoading(true);

    try {
      const res = await sendMessage(activeChatId, text,setLoading,setMessageStream);// { reply, chatId }
      // refresh the active chat from server to get both messages
      const refreshed = await getChat(activeChatId);
      setActiveChat(refreshed.chat);
      // refresh chat list so titles/lastMessage update
      setRefreshFlag((f) => f + 1);
    } catch (err) {
      console.error(err);
      // show local error message in UI
      setActiveChat((prev) =>
        prev
          ? {
              ...prev,
              messages: [
                ...prev.messages,
                { text: "⚠️ Error sending message", isUser: false },
              ],
            }
          : prev
      );
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
        onDeleteChat={handleDeleteChat}
      />
      <div className="flex flex-col flex-1 bg-[#343541]">
        <Header/>
        <ThemeToggle />
       <div
    className="
      flex-1 overflow-y-auto
      px-4 pb-6

      [&::-webkit-scrollbar]:hidden
      [-ms-overflow-style:none]
      [scrollbar-width:none]
      bg-white dark:bg-[#212121]
    "
  >
    {activeChat ? (
      <>
        {activeChat.messages.map((msg, idx) => (
          <ChatMessage
            key={idx}
            message={msg.text}
            isUser={msg.isUser}
          />
        ))}

        {loading && (
          <>
            <ChatMessage message={message} isUser={true} />
            <ChatMessage message={messageStream} isUser={false} />
          </>
        )}
      </>
    ) : (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-400 dark:text-gray-500 text-sm">
          Select or start a chat
        </p>
      </div>
    )}
  </div>
        {activeChat && <ChatInput onSend={handleSend} message={message} setMessage={setMessage} />}

      </div>
       {visible && (
        <TranslateMenu
          x={position.x}
          y={position.y}
          onTranslate={handleTranslate}
        />
      )}

      {showPopup && (
        <TranslationPopup
          original={selectedText}
          translated={translation}
          onClose={() => setShowPopup(false)}
        />
      )}
    </div>
  );
}
