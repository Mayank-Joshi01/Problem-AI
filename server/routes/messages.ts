import { Router } from "express";
import { Chat } from "../models/Chat.js";

const router = Router();

/**
 * POST /api/chats/:id/messages
 * Body: { text: string }
 * Saves the user message, calls OpenAI, saves assistant reply, returns reply
 */

router.post("/:id/messages", async (req, res) => {
  const chatId = req.params.id;
  const { text } = req.body;

  if (!text) return res.status(400).json({ error: "text is required" });

  try {
    const chat = await Chat.findById(chatId);
    if (!chat) return res.status(404).json({ error: "Chat not found" });

    // Save user message
    chat.messages.push({ text, isUser: true, createdAt: new Date() });
    

    const promptMessages = [{ role: "user", content: text }];
    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        model: "phi3:mini",
        prompt:promptMessages,
        stream: false,
      }),
    }).then(res => res.json());

    console.log("OpenAI response:", response);
    const reply = response.choices?.[0]?.message?.content ?? "Sorry, no response.";

    // Save assistant message
    chat.messages.push({ text: reply, isUser: false, createdAt: new Date() });

    // Optionally update the chat title if it was "New Chat" and first user message exists
    if (!chat.title || chat.title === "New Chat") {
      chat.title = text.length > 40 ? text.slice(0, 40) + "..." : text;
    }

    await chat.save();

    res.json({ reply, chatId: chat._id });
  } catch (err) {
    console.error("Error in /messages:", err);
    res.status(500).json({ error: "Failed to send message" });
  }
});

export default router;