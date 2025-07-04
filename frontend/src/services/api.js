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
