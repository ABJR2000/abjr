import { useEffect, useState } from 'react';
import { fetchUserProfile } from '../services/api';

export default function UserProfile() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchProfile = async () => {
      try {
        const data = await fetchUserProfile(token);
        console.log("Perfil cargado:", data);
        setUserData(data);
      } catch (err) {
        console.error("Error al cargar perfil:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="max-w-lg mx-auto mt-8 p-4 bg-white rounded shadow text-center">
        <p className="text-gray-500">Cargando perfil...</p>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="max-w-lg mx-auto mt-8 p-4 bg-white rounded shadow text-center">
        <p className="text-red-500">No se pudo cargar el perfil</p>
      </div>
    );
  }

  return (
    <div className="container max-w-3xl mx-auto mt-8 p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">👤 Mi Perfil</h2>
      <div className="space-y-2">
        <p><span className="font-semibold">DNI:</span> {userData.dni}</p>
        <p><span className="font-semibold">Email:</span> {userData.email}</p>
        <p><span className="font-semibold">Teléfono:</span> {userData.telefono ?? "No registrado"}</p>
        <p><span className="font-semibold">Coche Asignado:</span> {userData.coche_asignado}</p>
      </div>

     
    </div>
  );
}
