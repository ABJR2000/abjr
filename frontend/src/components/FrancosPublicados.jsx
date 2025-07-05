import { useEffect, useState } from "react";
import { obtenerFrancosPublicados, proponerIntercambio, getMisFrancos } from "../services/api";

export default function FrancosPublicados({ token, refreshMisFrancos }) {
  const [francos, setFrancos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [proponiendoId, setProponiendoId] = useState(null);
  const [misFrancos, setMisFrancos] = useState([]);

  // Cargar francos publicados
  const fetchFrancosPublicados = async () => {
    try {
      const data = await obtenerFrancosPublicados(token);
      setFrancos(data);
    } catch (error) {
      console.error("Error al cargar francos publicados:", error);
    } finally {
      setLoading(false);
    }
  };

  // Cargar mis francos
  const fetchMisFrancos = async () => {
    try {
      const data = await getMisFrancos(token);
      setMisFrancos(data);
    } catch (error) {
      console.error("Error al cargar mis francos:", error);
    }
  };

  useEffect(() => {
    fetchFrancosPublicados();
    fetchMisFrancos();
  }, [token]);

  const handleProponer = async (francoPublicadoId, francoPropuestoId) => {
    setProponiendoId(francoPublicadoId);
    try {
      await proponerIntercambio(token, {
        francoPublicadoId,
        francoPropuestoId,
      });
      alert("✅ Intercambio propuesto correctamente");

      // 🔥 Actualizar listas tras proponer
      await fetchFrancosPublicados(); // refrescar lista de publicados
      await fetchMisFrancos(); // refrescar mis francos
      refreshMisFrancos(); // refrescar en componente padre

    } catch (error) {
      alert("❌ Error al proponer intercambio: " + error.message);
    } finally {
      setProponiendoId(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">📢 Francos Disponibles para Intercambio</h2>
      {loading ? (
        <p className="text-center">Cargando francos publicados...</p>
      ) : francos.length === 0 ? (
        <p className="text-center text-gray-500">No hay francos publicados por otros empleados.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {francos.map((franco) => (
            <div
              key={franco.id}
              className="p-4 rounded border border-blue-500 bg-blue-50"
            >
              <h3 className="font-semibold">{franco.fecha}</h3>
              <p className="text-sm mt-1 text-blue-700">
                Publicado por: {franco.email}
              </p>

              {/* 🔥 Proponer intercambio: lista de mis francos */}
              <div className="mt-3">
                <label className="block text-sm font-medium mb-1">
                  Selecciona uno de tus francos para proponer:
                </label>
                {misFrancos.length === 0 ? (
                  <p className="text-gray-500 text-sm">No tienes francos para intercambiar.</p>
                ) : (
                  <select
                    className="w-full border rounded px-2 py-1"
                    onChange={(e) => {
                      const francoPropuestoId = e.target.value;
                      if (francoPropuestoId) {
                        handleProponer(franco.id, francoPropuestoId);
                      }
                    }}
                    defaultValue=""
                  >
                    <option value="" disabled>
                      -- Selecciona tu franco --
                    </option>
                    {misFrancos
                      .filter((f) => f.estado === "aprobado" || f.estado === "pendiente")
                      .map((f) => (
                        <option key={f.id} value={f.id}>
                          {f.fecha} ({f.estado})
                        </option>
                      ))}
                  </select>
                )}
              </div>

              {proponiendoId === franco.id && (
                <p className="text-sm text-gray-500 mt-2">Proponiendo intercambio...</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
