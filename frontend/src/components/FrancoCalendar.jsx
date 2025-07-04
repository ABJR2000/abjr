import { useEffect, useState } from 'react';
import { getFrancos,fetchUserProfile } from '../services/api';




export default function FrancoCalendar({ token }) {
  const [francos, setFrancos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  useEffect(() => {
    const fetchFrancos = async () => {
      try {
        const data = await getFrancos(token);
        setFrancos(data);
        
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFrancos();
  }, [token]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetchUserProfile(token)
        .then((data) => {
            console.log("Perfil cargado:", data);
            setUserData(data); // suponiendo que usás un estado para mostrarlo
        })
        .catch((err) => {
            console.error(err.message);
        });
}, []);
  return (
    <div className="max-w-3xl mx-auto mt-8 p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">📅 Mis Francos</h2>
      {loading ? (
        <p className="text-center">Cargando...</p>
      ) : francos.length === 0 ? (
        <p className="text-center text-gray-500">No tienes francos registrados.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {francos.map((franco) => (
            <div
              key={franco.id}
              className={`p-4 rounded border ${
                franco.estado === 'aprobado'
                  ? 'border-green-500 bg-green-50'
                  : 'border-yellow-500 bg-yellow-50'
              }`}
            >
              <h3 className="font-semibold">{franco.fecha}</h3>
              {/* <p>{franco.motivo}</p> */}
              <p
                className={`text-sm mt-1 ${
                  franco.estado === 'aprobado'
                    ? 'text-green-700'
                    : 'text-yellow-700'
                }`}
              >
                {franco.estado.toUpperCase()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
