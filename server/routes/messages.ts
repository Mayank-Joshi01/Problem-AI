import { Router } from "express";
import { Chat } from "../models/Chat.js";

const router = Router();

router.post("/:id/messages", async (req, res) => {
  const Ollama_API = `http://localhost:11434/api/chat`;
  //const Ollama_API = "http://192.168.29.241:11434/api/chat";
  const chatId = req.params.id;
  const { text } = req.body;

  if (!text) return res.status(400).json({ error: "text is required" });

  try {
    const chat = await Chat.findById(chatId);
    if (!chat) return res.status(404).json({ error: "Chat not found" });

    // Save user message immediately
    chat.messages.push({ text, isUser: true, createdAt: new Date() });

    // --- STREAM SETUP ---
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    // Request streaming from Ollama
    const ollamaRes = await fetch(Ollama_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "TinyLlama",
        messages: [{ role: "user", content: text }],
        stream: true,
      }),
    });

    if (!ollamaRes.body) throw new Error("No stream from Ollama");

    const reader = ollamaRes.body.getReader();
    const decoder = new TextDecoder();

    let fullReply = ""; // accumulate full model reply

    // STREAM LOOP
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });

      for (const line of chunk.split("\n")) {
        if (!line.trim()) continue;

        try {
          const json = JSON.parse(line);
          const token = json.message?.content;
          if (!token) continue;

          fullReply += token; // accumulate full response

          // Stream token to browser
          res.write(`data: ${token}\n\n`);

        } catch (err) {
          console.log("JSON parse error:", err);
        }
      }
    }

    // End streaming
    res.write("data: [DONE]\n\n");
    res.end();

    // Save assistant message after stream closes
    chat.messages.push({
      text: fullReply,
      isUser: false,
      createdAt: new Date(),
    });

    // update chat title if needed
    if (!chat.title || chat.title === "New Chat") {
      chat.title = text.slice(0, 40) + "...";
    }

    await chat.save();

  } catch (err) {
    console.error("Streaming error:", err);
    res.write(`data: ERROR: ${err.message}\n\n`);
    res.end();
  }
});

export default router;