// ============================================
// PegaGol API - Modo Demo (localStorage)
// Todo funciona sin backend, datos en el navegador
// ============================================

import { ALL_STICKERS, STICKERS_BY_TEAM, STICKER_MAP } from './stickerData';

const STORAGE_KEYS = {
  users: 'pegagol_users',
  userStickers: 'pegagol_user_stickers',
  trades: 'pegagol_trades',
  messages: 'pegagol_messages',
  nextId: 'pegagol_next_id',
};

// ---- Helpers ----

function getStore(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || null;
  } catch { return null; }
}

function setStore(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function getNextId() {
  const id = getStore(STORAGE_KEYS.nextId) || 1000;
  setStore(STORAGE_KEYS.nextId, id + 1);
  return id;
}

function getAllUsers() {
  return getStore(STORAGE_KEYS.users) || [];
}

function saveUsers(users) {
  setStore(STORAGE_KEYS.users, users);
}

function getUserStickersMap(userId) {
  const all = getStore(STORAGE_KEYS.userStickers) || {};
  return all[String(userId)] || {};
}

function saveUserStickers(userId, stickersMap) {
  const all = getStore(STORAGE_KEYS.userStickers) || {};
  all[String(userId)] = stickersMap;
  setStore(STORAGE_KEYS.userStickers, all);
}

function getAllTrades() {
  return getStore(STORAGE_KEYS.trades) || [];
}

function saveTrades(trades) {
  setStore(STORAGE_KEYS.trades, trades);
}

function getAllMessages() {
  return getStore(STORAGE_KEYS.messages) || [];
}

function saveMessages(msgs) {
  setStore(STORAGE_KEYS.messages, msgs);
}

// ---- Users ----

export const registerUser = (nombre, salon) => {
  const users = getAllUsers();
  const user = {
    id: getNextId(),
    nombre,
    salon,
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  saveUsers(users);
  return Promise.resolve(user);
};

export const getUser = (id) => {
  const users = getAllUsers();
  const user = users.find(u => u.id === id);
  return Promise.resolve(user || null);
};

export const getUsers = () => {
  const users = getAllUsers();
  return Promise.resolve(users.sort((a, b) => a.nombre.localeCompare(b.nombre)));
};

// ---- Stickers ----

export const getAllStickers = () => {
  return Promise.resolve(STICKERS_BY_TEAM);
};

export const getUserAlbum = (userId) => {
  const userMap = getUserStickersMap(userId);

  const equipos = {};
  let tiene = 0, repetidas = 0, faltan = 0;

  for (const [team, stickers] of Object.entries(STICKERS_BY_TEAM)) {
    equipos[team] = stickers.map(s => {
      const cantidad = userMap[s.id] || 0;
      if (cantidad === 0) faltan++;
      else {
        tiene++;
        if (cantidad >= 2) repetidas += cantidad - 1;
      }
      return { ...s, cantidad };
    });
  }

  return Promise.resolve({
    stats: { tiene, repetidas, faltan },
    equipos,
  });
};

export const toggleSticker = (userId, stickerId) => {
  const userMap = getUserStickersMap(userId);
  const current = userMap[stickerId] || 0;

  if (current === 0) userMap[stickerId] = 1;
  else if (current === 1) userMap[stickerId] = 2;
  else delete userMap[stickerId];

  saveUserStickers(userId, userMap);
  return Promise.resolve({ cantidad: userMap[stickerId] || 0 });
};

export const searchStickers = (q, userId) => {
  const query = q.toUpperCase();
  const found = ALL_STICKERS.filter(s =>
    s.codigo.toUpperCase().includes(query) ||
    s.equipo.toUpperCase().includes(query) ||
    s.nombreJugador.toUpperCase().includes(query)
  ).slice(0, 30);

  // Find who has each sticker repeated (except current user)
  const users = getAllUsers();
  const results = found.map(sticker => {
    const disponibleEn = [];
    for (const u of users) {
      if (u.id === userId) continue;
      const uMap = getUserStickersMap(u.id);
      const cant = uMap[sticker.id] || 0;
      if (cant >= 2) {
        disponibleEn.push({
          userId: u.id,
          nombre: u.nombre,
          salon: u.salon,
          cantidadRepetida: cant - 1,
        });
      }
    }
    return { ...sticker, disponibleEn };
  });

  return Promise.resolve(results);
};

// ---- Trades ----

export const createTrade = (data) => {
  const trades = getAllTrades();
  const users = getAllUsers();

  const trade = {
    id: getNextId(),
    fromUserId: data.fromUserId,
    toUserId: data.toUserId,
    offerStickerId: data.offerStickerId,
    requestStickerId: data.requestStickerId,
    status: 'pending',
    createdAt: new Date().toISOString(),
    fromUser: users.find(u => u.id === data.fromUserId),
    toUser: users.find(u => u.id === data.toUserId),
    offerSticker: STICKER_MAP[data.offerStickerId],
    requestSticker: STICKER_MAP[data.requestStickerId],
  };

  trades.unshift(trade);
  saveTrades(trades);
  return Promise.resolve(trade);
};

export const getUserTrades = (userId) => {
  const trades = getAllTrades();
  const users = getAllUsers();
  const filtered = trades.filter(t => t.fromUserId === userId || t.toUserId === userId);

  // Enrich with latest user/sticker data
  return Promise.resolve(filtered.map(t => ({
    ...t,
    fromUser: users.find(u => u.id === t.fromUserId) || t.fromUser,
    toUser: users.find(u => u.id === t.toUserId) || t.toUser,
    offerSticker: STICKER_MAP[t.offerStickerId] || t.offerSticker,
    requestSticker: STICKER_MAP[t.requestStickerId] || t.requestSticker,
  })));
};

export const updateTrade = (id, status) => {
  const trades = getAllTrades();
  const idx = trades.findIndex(t => t.id === id);
  if (idx === -1) return Promise.reject(new Error('Trade not found'));

  const trade = trades[idx];
  trade.status = status;

  if (status === 'accepted') {
    // Atomic sticker exchange
    const fromMap = getUserStickersMap(trade.fromUserId);
    const toMap = getUserStickersMap(trade.toUserId);

    // fromUser loses offerSticker
    const fromOffer = fromMap[trade.offerStickerId] || 0;
    if (fromOffer <= 1) delete fromMap[trade.offerStickerId];
    else fromMap[trade.offerStickerId] = fromOffer - 1;

    // toUser gains offerSticker
    toMap[trade.offerStickerId] = (toMap[trade.offerStickerId] || 0) + 1;

    // toUser loses requestSticker
    const toRequest = toMap[trade.requestStickerId] || 0;
    if (toRequest <= 1) delete toMap[trade.requestStickerId];
    else toMap[trade.requestStickerId] = toRequest - 1;

    // fromUser gains requestSticker
    fromMap[trade.requestStickerId] = (fromMap[trade.requestStickerId] || 0) + 1;

    saveUserStickers(trade.fromUserId, fromMap);
    saveUserStickers(trade.toUserId, toMap);
  }

  saveTrades(trades);
  return Promise.resolve(trade);
};

// ---- Messages ----

export const sendMessage = (data) => {
  const msgs = getAllMessages();
  const msg = {
    id: getNextId(),
    senderId: data.senderId,
    receiverId: data.receiverId,
    content: data.content,
    read: false,
    createdAt: new Date().toISOString(),
  };
  msgs.push(msg);
  saveMessages(msgs);
  return Promise.resolve(msg);
};

export const getConversations = (userId) => {
  const msgs = getAllMessages();
  const users = getAllUsers();
  const convMap = {};

  for (const msg of msgs) {
    if (msg.senderId !== userId && msg.receiverId !== userId) continue;
    const otherId = msg.senderId === userId ? msg.receiverId : msg.senderId;
    if (!convMap[otherId]) {
      convMap[otherId] = { lastMessage: msg, unread: 0 };
    }
    // Keep most recent message
    if (new Date(msg.createdAt) > new Date(convMap[otherId].lastMessage.createdAt)) {
      convMap[otherId].lastMessage = msg;
    }
    // Count unread
    if (msg.senderId !== userId && !msg.read) {
      convMap[otherId].unread++;
    }
  }

  const conversations = Object.entries(convMap).map(([otherId, data]) => ({
    user: users.find(u => u.id === Number(otherId)) || { id: Number(otherId), nombre: '?', salon: '?' },
    lastMessage: data.lastMessage,
    unread: data.unread,
  }));

  // Sort by latest message
  conversations.sort((a, b) => new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt));

  return Promise.resolve(conversations);
};

export const getMessages = (userId, otherId) => {
  const msgs = getAllMessages();

  const conversation = msgs.filter(m =>
    (m.senderId === userId && m.receiverId === otherId) ||
    (m.senderId === otherId && m.receiverId === userId)
  );

  // Mark as read
  const allMsgs = getAllMessages();
  let changed = false;
  for (const m of allMsgs) {
    if (m.senderId === otherId && m.receiverId === userId && !m.read) {
      m.read = true;
      changed = true;
    }
  }
  if (changed) saveMessages(allMsgs);

  conversation.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  return Promise.resolve(conversation);
};
