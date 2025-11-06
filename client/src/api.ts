// src/api.ts
// const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";
const API_BASE = `${window.location.protocol}//${window.location.hostname}:5000/api`;

export async function listChats() {
  const res = await fetch(`${API_BASE}/chats`);
  if (!res.ok) throw new Error("Failed to fetch chats");
  return res.json(); // { chats: [...] }
}

export async function createChat() {
  const res = await fetch(`${API_BASE}/chats`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Failed to create chat");
  return res.json(); // { chatId, title }
}

export async function getChat(chatId: string) {
  const res = await fetch(`${API_BASE}/chats/${chatId}`);
  if (!res.ok) throw new Error("Failed to fetch chat");
  return res.json(); // { chat }
}

export async function sendMessage(chatId: string, text: string) {
  const res = await fetch(`${API_BASE}/chats/${chatId}/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to send message");
  }
  return res.json(); // { reply, chatId }
}

export async function deleteChat(chatId: string) {
  const res = await fetch(`${API_BASE}/chats/${chatId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete chat");
  return res.json();
}
