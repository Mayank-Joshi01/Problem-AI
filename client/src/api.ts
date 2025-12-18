// src/api.ts
// const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";
const API_BASE = `${window.location.protocol}//${window.location.hostname}:5000/api`;

// const API_BASE = "http://localhost:5000/api";

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

/// IMORTANT MESSAGE FOR ME IN THE FUTURE: If any issue occur in future due to rerandering of components while streaming, consider using useRef instead 
//                                         of useState for messageStream.
export async function sendMessage(chatId: string, text: string,setLoading: (loading: boolean) => void,setMessageStream: (stream: string) => void) {
  const resp = await fetch(`${API_BASE}/chats/${chatId}/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

    if (!resp.body) return;

    const reader = resp.body.pipeThrough(new TextDecoderStream('utf-8')).getReader();

    let currentText = "";
    setLoading(true);
     while (true) {
      const{ done, value } = await reader.read();
      if (done) break;
      /// The value is just simple text no need to parse JSON here
      const lines = value.split("\n").filter((line) => line.startsWith("data: "));
      for (const line of lines) {
        const token = line.replace("data: ", " ");
        if (token === "[DONE]") break;
        currentText += token;
        setMessageStream(currentText);}}    

  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    throw new Error(err.error || "Failed to send message");
  }
  return ; 
}



export async function deleteChat(chatId: string) {
  const res = await fetch(`${API_BASE}/chats/${chatId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete chat");
  return res.json();
}
