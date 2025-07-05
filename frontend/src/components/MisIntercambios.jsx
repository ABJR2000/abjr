import React, { useEffect, useState } from "react";
import { getMisTrades, responderIntercambio } from "../services/trades";

const MisIntercambios = ({ token }) => {
  const [trades, setTrades] = useState([]);
  const [isLoading, setIsLoading] = useState(false);




  useEffect(() => {
    const fetchData = async () => {
      const data = await getMisTrades(token);
      setTrades(data);
    };
    fetchData();
  }, [token]);

  const handleRespuesta = async (tradeId, estado) => {
  setIsLoading(true);
  try {
    await responderIntercambio(token, tradeId, estado);
    alert(`✅ Solicitud ${estado}`);
    setTrades(trades.map((t) => (t.id === tradeId ? { ...t, estado } : t)));
  } catch (err) {
    console.error(err);
    alert("❌ Error al procesar solicitud");
  }
  setIsLoading(false);
};

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Mis solicitudes de intercambio</h2>
      {trades.length === 0 && <p>No tienes intercambios.</p>}
      {trades.map((trade) => (
        <div key={trade.id} className="border p-3 rounded mb-2">
          <p>
            📅 Tu franco: <b>{trade.fecha_franco_publicado}</b>
          </p>
          <p>
            🔁 Propuesto por: <b>{trade.nombre_proponente}</b> con su franco:{" "}
            <b>{trade.fecha_franco_propuesto}</b>
          </p>
          <p>Estado: <b>{trade.estado}</b></p>
          {trade.estado === "pendiente" && user.id === trade.duenio_franco_publicado && (
  <div className="mt-2">
    <button
      onClick={() => handleRespuesta(trade.id, "aprobado")}
      className="bg-green-500 text-white px-3 py-1 rounded mr-2"
      disabled={isLoading}
    >
      ✅ Aprobar
    </button>
    <button
      onClick={() => handleRespuesta(trade.id, "rechazado")}
      className="bg-red-500 text-white px-3 py-1 rounded"
    >
      ❌ Rechazar
    </button>
  </div>
)}


        </div>
      ))}
    </div>
  );
};

export default MisIntercambios;
