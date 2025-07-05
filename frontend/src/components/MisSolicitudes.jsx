import { useEffect, useState } from "react";
import { listarMisTrades, responderIntercambio } from "../services/api";

export default function MisSolicitudes({ token }) {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [procesandoId, setProcesandoId] = useState(null);

  useEffect(() => {
    async function cargarSolicitudes() {
      try {
        const data = await listarMisTrades(token);
        setSolicitudes(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    cargarSolicitudes();
  }, [token]);

  const handleResponder = async (id, estado) => {
    setProcesandoId(id);
    try {
      await responderIntercambio(token, id, { estado });
      alert(`Intercambio ${estado} ✅`);
      // refrescar lista
      const data = await listarMisTrades(token);
      setSolicitudes(data);
    } catch (error) {
      alert("Error al responder: " + error.message);
    } finally {
      setProcesandoId(null);
    }
  };

  if (loading) return <p>Cargando solicitudes...</p>;

  return (
    <div>
      <h2>Mis Solicitudes de Intercambio</h2>
      {solicitudes.length === 0 && <p>No tienes solicitudes pendientes.</p>}
      <ul>
        {solicitudes.map((s) => (
          <li key={s.id} style={{ marginBottom: "1rem", border: "1px solid #ccc", padding: "1rem" }}>
            <div>
              <b>Estado:</b> {s.estado.toUpperCase()}
            </div>
            <div>
              <b>Fecha Propuesta:</b> {new Date(s.fecha_propuesta).toLocaleDateString()}
            </div>
            <div>
              <b>Franco publicado:</b> {s.fecha_franco_publicado} ({s.publicador_email})
            </div>
            <div>
              <b>Franco propuesto:</b> {s.fecha_franco_propuesto} ({s.proponente_email})
            </div>

            {/* Solo si la solicitud está pendiente y el usuario es dueño del franco publicado puede responder */}
            {s.estado === "pendiente" && (
              <div style={{ marginTop: "0.5rem" }}>
                <button
                  onClick={() => handleResponder(s.id, "aprobado")}
                  disabled={procesandoId === s.id}
                  style={{ marginRight: "0.5rem" }}
                >
                  {procesandoId === s.id ? "Procesando..." : "Aprobar"}
                </button>
                <button
                  onClick={() => handleResponder(s.id, "rechazado")}
                  disabled={procesandoId === s.id}
                >
                  {procesandoId === s.id ? "Procesando..." : "Rechazar"}
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
