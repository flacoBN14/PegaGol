const express = require("express");
const { PrismaClient } = require("@prisma/client");

const router = express.Router();
const prisma = new PrismaClient();

// Obtener todas las estampas agrupadas por equipo
router.get("/", async (_req, res) => {
  try {
    const stickers = await prisma.sticker.findMany({
      orderBy: [{ equipo: "asc" }, { numero: "asc" }],
    });

    // Agrupar por equipo
    const grouped = {};
    for (const s of stickers) {
      if (!grouped[s.equipo]) grouped[s.equipo] = [];
      grouped[s.equipo].push(s);
    }
    res.json(grouped);
  } catch (error) {
    console.error("Error al obtener estampas:", error);
    res.status(500).json({ error: "Error al obtener estampas" });
  }
});

// Obtener estampas de un usuario (su album)
router.get("/user/:userId", async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);

    const allStickers = await prisma.sticker.findMany({
      orderBy: [{ equipo: "asc" }, { numero: "asc" }],
    });

    const userStickers = await prisma.userSticker.findMany({
      where: { userId },
    });

    const userMap = new Map();
    for (const us of userStickers) {
      userMap.set(us.stickerId, us.cantidad);
    }

    const grouped = {};
    let tiene = 0;
    let repetidas = 0;
    let faltan = 0;

    for (const s of allStickers) {
      if (!grouped[s.equipo]) grouped[s.equipo] = [];
      const cantidad = userMap.get(s.id) || 0;

      if (cantidad === 0) faltan++;
      else if (cantidad === 1) tiene++;
      else {
        tiene++;
        repetidas += cantidad - 1;
      }

      grouped[s.equipo].push({
        ...s,
        cantidad,
      });
    }

    res.json({
      stats: { tiene, repetidas, faltan },
      equipos: grouped,
    });
  } catch (error) {
    console.error("Error al obtener album:", error);
    res.status(500).json({ error: "Error al obtener album" });
  }
});

// Actualizar estampa de usuario (toggle: no tiene -> tiene -> repetida -> no tiene)
router.post("/user/:userId/toggle", async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const { stickerId } = req.body;

    const existing = await prisma.userSticker.findUnique({
      where: { userId_stickerId: { userId, stickerId } },
    });

    if (!existing) {
      // No la tiene -> la tiene (1)
      await prisma.userSticker.create({
        data: { userId, stickerId, cantidad: 1 },
      });
      res.json({ cantidad: 1 });
    } else if (existing.cantidad === 1) {
      // La tiene -> repetida (2)
      await prisma.userSticker.update({
        where: { id: existing.id },
        data: { cantidad: 2 },
      });
      res.json({ cantidad: 2 });
    } else {
      // Repetida -> no la tiene (eliminar)
      await prisma.userSticker.delete({
        where: { id: existing.id },
      });
      res.json({ cantidad: 0 });
    }
  } catch (error) {
    console.error("Error al actualizar estampa:", error);
    res.status(500).json({ error: "Error al actualizar estampa" });
  }
});

// Buscar estampa por codigo o equipo, ver quien la tiene repetida
router.get("/search", async (req, res) => {
  try {
    const { q, userId } = req.query;
    if (!q) return res.json([]);

    const currentUserId = userId ? parseInt(userId) : null;

    const stickers = await prisma.sticker.findMany({
      where: {
        OR: [
          { codigo: { contains: q.toUpperCase() } },
          { equipo: { contains: q } },
          { nombreJugador: { contains: q } },
        ],
      },
      include: {
        userStickers: {
          where: { cantidad: { gte: 2 } },
          include: { user: true },
        },
      },
    });

    const results = stickers.map((s) => ({
      ...s,
      disponibleEn: s.userStickers
        .filter((us) => us.userId !== currentUserId)
        .map((us) => ({
          userId: us.user.id,
          nombre: us.user.nombre,
          salon: us.user.salon,
          cantidadRepetida: us.cantidad - 1,
        })),
    }));

    res.json(results);
  } catch (error) {
    console.error("Error al buscar estampas:", error);
    res.status(500).json({ error: "Error al buscar estampas" });
  }
});

module.exports = router;
