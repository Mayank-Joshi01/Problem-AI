// src/routes/chats.ts
import { Router } from "express";
import { Chat } from "../models/Chat.js";

const router = Router();

/**
 * GET /api/chats
 * Return list of chats (id, title, lastMessage, updatedAt)
 */
router.get("/", async (req, res) => {
  try {
    const chats = await Chat.find()
      .sort({ updatedAt: -1 })
      .select("title messages updatedAt")
      .lean();

    const summary = chats.map((c) => ({
      id: c._id,
      title: c.title,
      updatedAt: c.updatedAt,
      lastMessage: c.messages?.length ? c.messages[c.messages.length - 1] : null,
    }));
    res.json({ chats: summary });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load chats" });
  }
});

/**
 * POST /api/chats
 * Create a new chat
 */
router.post("/", async (req, res) => {
  try {
    const chat = new Chat();
    await chat.save();
    res.status(201).json({ chatId: chat._id, title: chat.title });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create chat" });
  }
});


/**
 * GET /api/chats/:id
 * Fetch a single chat with all messages
 */
router.get("/:id", async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id).lean();
    if (!chat) return res.status(404).json({ error: "Chat not found" });
    res.json({ chat });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load chat" });
  }
});

/**
 * DELETE /api/chats/:id
 */
router.delete("/:id", async (req, res) => {
  try {
    await Chat.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete chat" });
  }
});

export default router;