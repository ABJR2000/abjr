import React, { useEffect, useState } from "react";
import { getFrancosPublicados, proponerIntercambio } from "../services/trades";
import { getFrancos } from "../services/api";

const Publicados = ({ token }) => {
  const [publicados, setPublicados] = useState([]);
  const [misFrancos, setMisFrancos] = useState([]);
  const [francoSeleccionado, setFrancoSeleccionado] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const pubs = await getFrancosPublicados(token);
      const francos = await getFrancos(token);
      setPublicados(pubs);
      setMisFrancos(francos.filter((f) => f.estado === "pendiente"));
    };
    fetchData();
  }, [token]);

  const handleProponer = async (francoPublicadoId) => {
    if (!francoSeleccionado) {
      alert("Selecciona uno de tus francos para proponer");
      return;
    }
    try {
      await proponerIntercambio(token, francoPublicadoId, francoSeleccionado);
      alert("✅ Propuesta enviada");
    } catch (err) {
      console.error(err);
      alert("❌ Error al proponer intercambio");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Francos publicados para intercambio</h2>
      {publicados.length === 0 && <p>No hay francos publicados.</p>}
      {publicados.map((franco) => (
        <div key={franco.id} className="border p-3 rounded mb-2">
          <p>
            📅 Fecha: <b>{franco.fecha}</b> | 👤 {franco.nombre} ({franco.email})
          </p>
          <select
            onChange={(e) => setFrancoSeleccionado(e.target.value)}
            className="border rounded p-1 mt-2"
          >
            <option value="">Selecciona tu franco</option>
            {misFrancos.map((f) => (
              <option key={f.id} value={f.id}>
                📅 {f.fecha}
              </option>
            ))}
          </select>
          <button
            onClick={() => handleProponer(franco.id)}
            className="bg-blue-500 text-white px-3 py-1 rounded ml-2"
          >
            Proponer Intercambio
          </button>
        </div>
      ))}
    </div>
  );
};

export default Publicados;
