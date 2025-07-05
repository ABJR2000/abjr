import { useEffect, useState } from "react";
import { getFrancos, fetchUserProfile, publicarFranco } from "../services/api";

export default function FrancoCalendar({ token, refresh }) {
  const [francos, setFrancos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [publicandoId, setPublicandoId] = useState(null); // para controlar botón cargando

  const fetchFrancos = async () => {
    setLoading(true);
    try {
      const data = await getFrancos(token);
      setFrancos(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFrancos();
  }, [token, refresh]); // 🔥 se actualiza cuando cambia `refresh`

  useEffect(() => {
    fetchUserProfile(token)
      .then(setUserData)
      .catch((err) => console.error(err.message));
  }, [token]);

  const handlePublicar = async (francoId) => {
    setPublicandoId(francoId);
    try {
      await publicarFranco(token, francoId);
      await fetchFrancos(); // 🔄 refrescar la lista después de publicar
      alert("✅ Franco publicado para intercambio");
    } catch (error) {
      alert("❌ Error al publicar franco: " + error.message);
    } finally {
      setPublicandoId(null);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-8 p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">📅 Mis Francos</h2>
      {loading ? (
        <p className="text-center">Cargando...</p>
      ) : francos.length === 0 ? (
        <p className="text-center text-gray-500">
          No tienes francos registrados.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {francos.map((franco) => (
            <div
              key={franco.id}
              className={`p-4 rounded border ${
                franco.estado === "aprobado"
                  ? "border-green-500 bg-green-50"
                  : franco.estado === "publicado"
                  ? "border-blue-500 bg-blue-50"
                  : franco.estado === "intercambiado"
                  ? "border-gray-400 bg-gray-100 text-gray-500"
                  : "border-yellow-500 bg-yellow-50"
              }`}
            >
              <h3 className="font-semibold">{franco.fecha}</h3>
              <p
                className={`text-sm mt-1 ${
                  franco.estado === "aprobado"
                    ? "text-green-700"
                    : franco.estado === "publicado"
                    ? "text-blue-700"
                    : franco.estado === "intercambiado"
                    ? "text-gray-600 italic"
                    : "text-yellow-700"
                }`}
              >
                {franco.estado ? franco.estado.toUpperCase() : "SIN ESTADO"}
              </p>

              {/* Botón para publicar solo si no está publicado o intercambiado */}
              {franco.estado !== "publicado" &&
                franco.estado !== "intercambiado" && (
                  <button
                    onClick={() => handlePublicar(franco.id)}
                    disabled={publicandoId === franco.id}
                    className="mt-3 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                  >
                    {publicandoId === franco.id
                      ? "Publicando..."
                      : "Publicar para intercambio"}
                  </button>
                )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
