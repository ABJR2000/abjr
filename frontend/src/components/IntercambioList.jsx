import { useEffect, useState } from 'react';
import { getIntercambios, actualizarIntercambio } from '../services/api';

export default function IntercambioList({ token }) {
  const [intercambios, setIntercambios] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchIntercambios = async () => {
    try {
      const data = await getIntercambios(token);
      setIntercambios(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIntercambios();
  }, [token]);

  const handleAction = async (id, estado) => {
    try {
      await actualizarIntercambio(token, id, estado);
      alert(`Intercambio ${estado} correctamente`);
      fetchIntercambios(); // refrescar la lista
    } catch (err) {
      console.error(err);
      alert('Error al actualizar el intercambio');
    }
  };

  return (
    <div className="container max-w-3xl mx-auto mt-8 p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">📥 Mis Intercambios</h2>
      {loading ? (
        <p className="text-center">Cargando...</p>
      ) : intercambios.length === 0 ? (
        <p className="text-center text-gray-500">No tienes solicitudes de intercambio.</p>
      ) : (
        <ul className="divide-y">
          {intercambios.map((item) => (
            <li key={item.id} className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">
                    {item.proponente_email} ↔ {item.publicador_email}
                  </p>
                  <p className="text-gray-600 text-sm">
                    Fecha solicitante: {item.fecha_franco_propuesto} | Fecha compañero: {item.fecha_franco_publicado}
                  </p>
                  <p
                    className={`mt-1 text-sm ${
                      item.estado === 'aprobado'
                        ? 'text-green-600'
                        : item.estado === 'rechazado'
                        ? 'text-red-600'
                        : 'text-yellow-600'
                    }`}
                  >
                    Estado: {item.estado.toUpperCase()}
                  </p>
                </div>

                {item.estado === 'pendiente' && (
                  <div className="space-x-2">
                    <button
                      onClick={() => handleAction(item.id, 'aprobado')}
                      className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      ✅ Aceptar
                    </button>
                    <button
                      onClick={() => handleAction(item.id, 'rechazado')}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      ❌ Rechazar
                    </button>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
