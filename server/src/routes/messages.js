const express = require("express");
const { PrismaClient } = require("@prisma/client");

const router = express.Router();
const prisma = new PrismaClient();

// Enviar mensaje
router.post("/", async (req, res) => {
  try {
    const { senderId, receiverId, content } = req.body;

    const message = await prisma.message.create({
      data: { senderId, receiverId, content },
      include: { sender: true, receiver: true },
    });

    const io = req.app.get("io");
    io.emit("new_message", message);

    res.status(201).json(message);
  } catch (error) {
    console.error("Error al enviar mensaje:", error);
    res.status(500).json({ error: "Error al enviar mensaje" });
  }
});

// Obtener conversaciones de un usuario
router.get("/conversations/:userId", async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);

    // Obtener los IDs de usuarios con los que ha chateado
    const messages = await prisma.message.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
      include: { sender: true, receiver: true },
      orderBy: { createdAt: "desc" },
    });

    // Agrupar por conversacion
    const conversationsMap = new Map();

    for (const msg of messages) {
      const otherId = msg.senderId === userId ? msg.receiverId : msg.senderId;
      const other = msg.senderId === userId ? msg.receiver : msg.sender;

      if (!conversationsMap.has(otherId)) {
        const unreadCount = await prisma.message.count({
          where: {
            senderId: otherId,
            receiverId: userId,
            read: false,
          },
        });

        conversationsMap.set(otherId, {
          user: other,
          lastMessage: msg,
          unread: unreadCount,
        });
      }
    }

    res.json(Array.from(conversationsMap.values()));
  } catch (error) {
    console.error("Error al obtener conversaciones:", error);
    res.status(500).json({ error: "Error al obtener conversaciones" });
  }
});

// Obtener mensajes entre dos usuarios
router.get("/:userId/:otherId", async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const otherId = parseInt(req.params.otherId);

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId, receiverId: otherId },
          { senderId: otherId, receiverId: userId },
        ],
      },
      include: { sender: true },
      orderBy: { createdAt: "asc" },
    });

    // Marcar como leidos los mensajes recibidos
    await prisma.message.updateMany({
      where: {
        senderId: otherId,
        receiverId: userId,
        read: false,
      },
      data: { read: true },
    });

    res.json(messages);
  } catch (error) {
    console.error("Error al obtener mensajes:", error);
    res.status(500).json({ error: "Error al obtener mensajes" });
  }
});

module.exports = router;
