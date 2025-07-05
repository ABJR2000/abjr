import axios from "axios";

const API_URL = "http://localhost:3000/api/trades";

// Obtener francos publicados
export const getFrancosPublicados = async (token) => {
  const res = await axios.get(`${API_URL}/publicados`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// Publicar un franco
export const publicarFranco = async (token, francoId) => {
  const res = await axios.post(
    `${API_URL}/publicar`,
    { francoId },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
};

// Proponer un intercambio
export const proponerIntercambio = async (token, francoPublicadoId, francoPropuestoId) => {
  const res = await axios.post(
    `${API_URL}/proponer`,
    { francoPublicadoId, francoPropuestoId },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
};

// Obtener mis intercambios
export const getMisTrades = async (token) => {
  const res = await axios.get(`${API_URL}/mis-trades`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// Aprobar o rechazar un intercambio
export const responderIntercambio = async (token, tradeId, estado) => {
  const res = await axios.patch(
    `${API_URL}/${tradeId}`,
    { estado },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
};
