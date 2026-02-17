const express = require("express");
const { PrismaClient } = require("@prisma/client");

const router = express.Router();
const prisma = new PrismaClient();

// Registrar usuario
router.post("/register", async (req, res) => {
  try {
    const { nombre, salon } = req.body;
    if (!nombre || !salon) {
      return res.status(400).json({ error: "Nombre y salon son requeridos" });
    }

    const user = await prisma.user.create({
      data: { nombre, salon },
    });
    res.status(201).json(user);
  } catch (error) {
    console.error("Error al registrar:", error);
    res.status(500).json({ error: "Error al registrar usuario" });
  }
});

// Obtener usuario por ID
router.get("/:id", async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        stickers: {
          include: { sticker: true },
        },
      },
    });
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    res.status(500).json({ error: "Error al obtener usuario" });
  }
});

// Listar todos los usuarios
router.get("/", async (_req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { nombre: "asc" },
    });
    res.json(users);
  } catch (error) {
    console.error("Error al listar usuarios:", error);
    res.status(500).json({ error: "Error al listar usuarios" });
  }
});

module.exports = router;
