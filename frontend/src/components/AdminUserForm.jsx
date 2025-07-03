import { useState } from 'react';
import { createUser } from '../services/api';

export default function AdminUserForm({ token }) {
  const [formData, setFormData] = useState({
    nombreApellido: '',
    email: '',
    dni: '',
    puesto: '',
    telefono: '',
    coche_asignado: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      await createUser(token, formData);
      setMessage('✅ Usuario creado exitosamente');
      setFormData({
        nombreApellido: '',
        email: '',
        dni: '',
        puesto: '',
        telefono: '',
        coche_asignado: '',
      });
    } catch (err) {
      console.error(err);
      setMessage(`❌ ${err.message || 'Error al crear usuario'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-8 p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Crear Usuario</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="nombreApellido"
          placeholder="Nombre y Apellido"
          className="w-full p-2 border rounded"
          value={formData.nombreApellido}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Correo Electrónico"
          className="w-full p-2 border rounded"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="dni"
          placeholder="DNI"
          className="w-full p-2 border rounded"
          value={formData.dni}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="puesto"
          placeholder="Puesto en la Empresa"
          className="w-full p-2 border rounded"
          value={formData.puesto}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="telefono"
          placeholder="Teléfono"
          className="w-full p-2 border rounded"
          value={formData.telefono}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="coche_asignado"
          placeholder="Número de Coche Asignado"
          className="w-full p-2 border rounded"
          value={formData.coche_asignado}
          onChange={handleChange}
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? 'Creando...' : 'Crear Usuario'}
        </button>
      </form>
      {message && <p className="mt-4 text-center text-sm">{message}</p>}
    </div>
  );
}
