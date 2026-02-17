const API = '/api';

async function request(url, options = {}) {
  const res = await fetch(`${API}${url}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Error desconocido' }));
    throw new Error(error.error || 'Error en la solicitud');
  }
  return res.json();
}

// Users
export const registerUser = (nombre, salon) =>
  request('/users/register', { method: 'POST', body: JSON.stringify({ nombre, salon }) });

export const getUser = (id) => request(`/users/${id}`);
export const getUsers = () => request('/users');

// Stickers
export const getAllStickers = () => request('/stickers');
export const getUserAlbum = (userId) => request(`/stickers/user/${userId}`);
export const toggleSticker = (userId, stickerId) =>
  request(`/stickers/user/${userId}/toggle`, { method: 'POST', body: JSON.stringify({ stickerId }) });
export const searchStickers = (q, userId) =>
  request(`/stickers/search?q=${encodeURIComponent(q)}&userId=${userId || ''}`);

// Trades
export const createTrade = (data) =>
  request('/trades', { method: 'POST', body: JSON.stringify(data) });
export const getUserTrades = (userId) => request(`/trades/user/${userId}`);
export const updateTrade = (id, status) =>
  request(`/trades/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) });

// Messages
export const sendMessage = (data) =>
  request('/messages', { method: 'POST', body: JSON.stringify(data) });
export const getConversations = (userId) => request(`/messages/conversations/${userId}`);
export const getMessages = (userId, otherId) => request(`/messages/${userId}/${otherId}`);
