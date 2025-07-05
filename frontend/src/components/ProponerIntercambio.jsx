import { useState } from 'react';
import { crearIntercambio } from '../services/api';

export default function ProponerIntercambio({ token }) {
  const [francoSolicitanteId, setFrancoSolicitanteId] = useState('');
  const [francoCompaneroId, setFrancoCompaneroId] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await crearIntercambio(token, { francoSolicitanteId, francoCompaneroId });
      setMensaje('✅ Solicitud de intercambio enviada.');
    } catch (err) {
      console.error(err);
      setMensaje('❌ Error al enviar la solicitud.');
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-8 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">🔁 Proponer Intercambio</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">ID de tu Franco</label>
          <input
            type="text"
            value={francoSolicitanteId}
            onChange={(e) => setFrancoSolicitanteId(e.target.value)}
            className="w-full border rounded p-2"
            placeholder="UUID de tu franco"
            required
          />
        </div>
        <div>
          <label className="block font-medium">ID del Franco del Compañero</label>
          <input
            type="text"
            value={francoCompaneroId}
            onChange={(e) => setFrancoCompaneroId(e.target.value)}
            className="w-full border rounded p-2"
            placeholder="UUID del franco del compañero"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white rounded p-2 hover:bg-blue-600"
        >
          Enviar Solicitud
        </button>
        {mensaje && <p className="text-center mt-2">{mensaje}</p>}
      </form>
    </div>
  );
}
