// Ensure DATABASE_URL is set for Prisma
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = "file:./dev.db";
}

const express = require("express");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");
const cors = require("cors");

const usersRouter = require("./routes/users");
const stickersRouter = require("./routes/stickers");
const tradesRouter = require("./routes/trades");
const messagesRouter = require("./routes/messages");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

app.use(cors());
app.use(express.json());

// Hacer io accesible en las rutas
app.set("io", io);

// Rutas
app.use("/api/users", usersRouter);
app.use("/api/stickers", stickersRouter);
app.use("/api/trades", tradesRouter);
app.use("/api/messages", messagesRouter);

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", app: "PegaGol" });
});

// Servir frontend en produccion
const clientDist = path.join(__dirname, "../../client/dist");
app.use(express.static(clientDist));
app.get("*", (_req, res) => {
  res.sendFile(path.join(clientDist, "index.html"));
});

// Socket.io - Chat en tiempo real
const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("Usuario conectado:", socket.id);

  socket.on("register", (userId) => {
    onlineUsers.set(userId, socket.id);
    socket.userId = userId;
  });

  socket.on("send_message", (data) => {
    const receiverSocket = onlineUsers.get(data.receiverId);
    if (receiverSocket) {
      io.to(receiverSocket).emit("new_message", data);
    }
  });

  socket.on("trade_update", (data) => {
    const receiverSocket = onlineUsers.get(data.toUserId);
    if (receiverSocket) {
      io.to(receiverSocket).emit("trade_notification", data);
    }
  });

  socket.on("disconnect", () => {
    if (socket.userId) {
      onlineUsers.delete(socket.userId);
    }
    console.log("Usuario desconectado:", socket.id);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`PegaGol server corriendo en http://localhost:${PORT}`);
});
