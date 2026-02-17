const express = require("express");
const { PrismaClient } = require("@prisma/client");

const router = express.Router();
const prisma = new PrismaClient();

// Crear propuesta de intercambio
router.post("/", async (req, res) => {
  try {
    const { fromUserId, toUserId, offerStickerId, requestStickerId } = req.body;

    const trade = await prisma.trade.create({
      data: { fromUserId, toUserId, offerStickerId, requestStickerId },
      include: {
        fromUser: true,
        toUser: true,
        offerSticker: true,
        requestSticker: true,
      },
    });

    // Notificar via socket
    const io = req.app.get("io");
    io.emit("trade_notification", trade);

    res.status(201).json(trade);
  } catch (error) {
    console.error("Error al crear intercambio:", error);
    res.status(500).json({ error: "Error al crear intercambio" });
  }
});

// Obtener intercambios de un usuario
router.get("/user/:userId", async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);

    const trades = await prisma.trade.findMany({
      where: {
        OR: [{ fromUserId: userId }, { toUserId: userId }],
      },
      include: {
        fromUser: true,
        toUser: true,
        offerSticker: true,
        requestSticker: true,
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(trades);
  } catch (error) {
    console.error("Error al obtener intercambios:", error);
    res.status(500).json({ error: "Error al obtener intercambios" });
  }
});

// Aceptar o rechazar intercambio
router.patch("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { status } = req.body;

    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({ error: "Status invalido" });
    }

    const trade = await prisma.trade.update({
      where: { id },
      data: { status },
      include: {
        fromUser: true,
        toUser: true,
        offerSticker: true,
        requestSticker: true,
      },
    });

    // Si se acepto, actualizar las cantidades de estampas
    if (status === "accepted") {
      // Reducir la estampa ofrecida del que propone
      const fromUserOffer = await prisma.userSticker.findUnique({
        where: {
          userId_stickerId: {
            userId: trade.fromUserId,
            stickerId: trade.offerStickerId,
          },
        },
      });
      if (fromUserOffer) {
        if (fromUserOffer.cantidad <= 1) {
          await prisma.userSticker.delete({ where: { id: fromUserOffer.id } });
        } else {
          await prisma.userSticker.update({
            where: { id: fromUserOffer.id },
            data: { cantidad: fromUserOffer.cantidad - 1 },
          });
        }
      }

      // Dar la estampa ofrecida al que acepta
      const toUserOffer = await prisma.userSticker.findUnique({
        where: {
          userId_stickerId: {
            userId: trade.toUserId,
            stickerId: trade.offerStickerId,
          },
        },
      });
      if (toUserOffer) {
        await prisma.userSticker.update({
          where: { id: toUserOffer.id },
          data: { cantidad: toUserOffer.cantidad + 1 },
        });
      } else {
        await prisma.userSticker.create({
          data: {
            userId: trade.toUserId,
            stickerId: trade.offerStickerId,
            cantidad: 1,
          },
        });
      }

      // Reducir la estampa pedida del que acepta
      const toUserRequest = await prisma.userSticker.findUnique({
        where: {
          userId_stickerId: {
            userId: trade.toUserId,
            stickerId: trade.requestStickerId,
          },
        },
      });
      if (toUserRequest) {
        if (toUserRequest.cantidad <= 1) {
          await prisma.userSticker.delete({ where: { id: toUserRequest.id } });
        } else {
          await prisma.userSticker.update({
            where: { id: toUserRequest.id },
            data: { cantidad: toUserRequest.cantidad - 1 },
          });
        }
      }

      // Dar la estampa pedida al que propuso
      const fromUserRequest = await prisma.userSticker.findUnique({
        where: {
          userId_stickerId: {
            userId: trade.fromUserId,
            stickerId: trade.requestStickerId,
          },
        },
      });
      if (fromUserRequest) {
        await prisma.userSticker.update({
          where: { id: fromUserRequest.id },
          data: { cantidad: fromUserRequest.cantidad + 1 },
        });
      } else {
        await prisma.userSticker.create({
          data: {
            userId: trade.fromUserId,
            stickerId: trade.requestStickerId,
            cantidad: 1,
          },
        });
      }
    }

    const io = req.app.get("io");
    io.emit("trade_notification", trade);

    res.json(trade);
  } catch (error) {
    console.error("Error al actualizar intercambio:", error);
    res.status(500).json({ error: "Error al actualizar intercambio" });
  }
});

module.exports = router;
