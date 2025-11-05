// Minimal API helper for frontend-backend integration
const BASE = import.meta.env.VITE_API_URL || '';

async function toBlob(dataUrl) {
  // fetch data URL to get a blob (works in modern browsers)
  const res = await fetch(dataUrl);
  return await res.blob();
}

export async function uploadAvatar(userId, dataUrl) {
  if (!BASE) throw new Error('No API base URL configured');
  if (!userId) throw new Error('Missing userId');
  const blob = await toBlob(dataUrl);
  const fd = new FormData();
  fd.append('avatar', blob, 'avatar.jpg');
  const resp = await fetch(`${BASE.replace(/\/$/, '')}/users/${userId}/avatar`, {
    method: 'POST',
    body: fd,
  });
  if (!resp.ok) {
    const txt = await resp.text();
    throw new Error(`Upload failed: ${resp.status} ${txt}`);
  }
  return resp.json(); // expect { avatarUrl: '...' } or updated user
}

export async function updateUser(userId, data) {
  if (!BASE) throw new Error('No API base URL configured');
  const resp = await fetch(`${BASE.replace(/\/$/, '')}/users/${userId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!resp.ok) {
    const txt = await resp.text();
    throw new Error(`Update failed: ${resp.status} ${txt}`);
  }
  return resp.json();
}

export function hasApi() {
  return Boolean(BASE);
}

export default { uploadAvatar, updateUser, hasApi };
