import React, { useEffect, useState } from "react";
import { getFrancos } from "../services/api";
import { publicarFranco } from "../services/trades";

const PublicarFranco = ({ token }) => {
  const [misFrancos, setMisFrancos] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getFrancos(token);
      setMisFrancos(data.filter((f) => f.estado === "pendiente" && !f.publicado));
    };
    fetchData();
  }, [token]);

  const handlePublicar = async (francoId) => {
    try {
      await publicarFranco(token, francoId);
      alert("✅ Franco publicado para intercambio");
      setMisFrancos(misFrancos.filter((f) => f.id !== francoId));
    } catch (err) {
      console.error(err);
      alert("❌ Error al publicar franco");
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow mt-4">
      <h3 className="text-xl font-semibold mb-2">📢 Publicar Franco</h3>
      {misFrancos.length === 0 ? (
        <option value="">No tienes francos disponibles</option>
      ) : (
        misFrancos
          .filter((f) => f.estado === 'aprobado') // solo aprobados
          .map((franco) => (
            <option key={franco.id} value={franco.id}>
              {franco.fecha}
            </option>
          ))
      )}

    </div>
  );
};

export default PublicarFranco;
