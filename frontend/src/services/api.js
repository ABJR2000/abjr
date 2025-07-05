import axios from 'axios';

const API_BASE = 'http://localhost:3000/api';

export const login = async (email, password) => {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Error al iniciar sesión');
  }
  return res.json(); // { token, role }
};

export const createUser = async (token, userData) => {
  const res = await fetch(`${API_BASE}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(userData),
  });

  const data = await res.json();
  console.log('Respuesta del backend:', data);

  if (!res.ok) {
    throw new Error(data.message || 'Error al crear usuario');
  }

  return data;
};

export const getFrancos = async (token) => {
  const res = await fetch(`${API_BASE}/francos`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('Error al obtener francos');
  return res.json();
};

export const fetchUserProfile = async (token) => {
  const res = await fetch(`${API_BASE}/personal/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const error = await res.json();
    console.error('Error al obtener perfil:', error.message);
    throw new Error(error.message || 'No se pudo obtener el perfil');
  }

  return res.json(); // Devuelve { dni, email, telefono, coche_asignado, vacaciones }
};

export const crearIntercambio = async (token, data) => {
  const res = await axios.post(`${API_BASE}/trades`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const getIntercambios = async (token) => {
  const res = await axios.get(`${API_BASE}/trades/mis-trades`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const actualizarIntercambio = async (token, id, estado) => {
  // ✅ Corrigimos la URL para apuntar a /trades/:id
  const res = await axios.patch(`${API_BASE}/trades/${id}`, { estado }, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const getMisFrancos = async (token) => {
  const res = await fetch(`${API_BASE}/personal/francos`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Error al obtener tus francos');
  return res.json(); // devuelve array de francos
};

export const publicarFranco = async (token, francoId) => {
  const res = await fetch(`${API_BASE}/trades/publicar`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ francoId }),
  });
  if (!res.ok) throw new Error('Error al publicar franco');
};

export const obtenerFrancosPublicados = async (token) => {
  const res = await fetch(`${API_BASE}/trades/publicados`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Error al obtener francos publicados');
  return res.json();
};

export const proponerIntercambio = async (token, body) => {
  const res = await fetch(`${API_BASE}/trades/proponer`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error('Error al proponer intercambio');
};

export const listarMisTrades = async (token) => {
  const res = await fetch(`${API_BASE}/trades/mis-trades`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Error al listar mis trades');
  return res.json();
};

export const responderIntercambio = async (token, id, body) => {
  const res = await fetch(`${API_BASE}/trades/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error('Error al responder intercambio');
};
