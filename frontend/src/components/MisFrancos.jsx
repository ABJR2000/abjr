import { useEffect, useState } from "react";
import { getMisFrancos } from "../services/api";

export default function MisFrancos({ token, refresh }) {
  const [francos, setFrancos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMisFrancos = async () => {
    setLoading(true);
    try {
      const data = await getMisFrancos(token);
      setFrancos(data);
    } catch (error) {
      console.error("Error al cargar mis francos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMisFrancos();
  }, [token, refresh]); // 🔥 se actualiza cuando cambia `refresh`

  return (
    <div className="max-w-3xl mx-auto mt-8 p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">📂 Mis Francos</h2>
      {loading ? (
        <p className="text-center">Cargando...</p>
      ) : francos.length === 0 ? (
        <p className="text-center text-gray-500">
          No tienes francos registrados.
        </p>
      ) : (
        <ul className="space-y-2">
          {francos.map((franco) => (
            <li
              key={franco.id}
              className={`p-3 rounded border ${
                franco.estado === "aprobado"
                  ? "border-green-500 bg-green-50"
                  : franco.estado === "publicado"
                  ? "border-blue-500 bg-blue-50"
                  : franco.estado === "intercambiado"
                  ? "border-gray-400 bg-gray-100 text-gray-500"
                  : "border-yellow-500 bg-yellow-50"
              }`}
            >
              {franco.fecha} -{" "}
              <span className="uppercase">{franco.estado}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
