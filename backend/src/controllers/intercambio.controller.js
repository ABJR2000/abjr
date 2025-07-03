import { db } from '../config/db.js';
import { v4 as uuidv4 } from 'uuid';

// ✅ Solicitar intercambio de franco
export const requestIntercambio = async (req, res) => {
  const { franco_id, cedido_a_id } = req.body;

  try {
    const id = uuidv4();

    await db.query(
      `INSERT INTO intercambios_francos (id, franco_id, cedido_por_id, cedido_a_id, estado)
       VALUES (?, ?, ?, ?, 'pendiente')`,
      [id, franco_id, req.user.id, cedido_a_id]
    );

    res.status(201).json({ message: 'Intercambio solicitado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al solicitar intercambio' });
  }
};

// ✅ Aceptar intercambio por otro empleado
export const acceptIntercambio = async (req, res) => {
  const intercambioId = req.params.id;

  try {
    const [rows] = await db.query(
      `SELECT * FROM intercambios_francos WHERE id = ? AND cedido_a_id = ?`,
      [intercambioId, req.user.id]
    );

    if (rows.length === 0)
      return res.status(404).json({ message: 'Intercambio no encontrado' });

    await db.query(
      `UPDATE intercambios_francos SET estado = 'aceptado' WHERE id = ?`,
      [intercambioId]
    );

    res.json({ message: 'Intercambio aceptado, pendiente de aprobación del admin' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al aceptar intercambio' });
  }
};

// ✅ Obtener intercambios del usuario actual
export const getIntercambiosByEmployee = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT * FROM intercambios_francos
       WHERE cedido_por_id = ? OR cedido_a_id = ?`,
      [req.user.id, req.user.id]
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener intercambios' });
  }
};

// ✅ Admin aprueba el intercambio
export const adminApproveIntercambio = async (req, res) => {
  const intercambioId = req.params.id;

  try {
    await db.query(
      `UPDATE intercambios_francos SET estado = 'aprobado' WHERE id = ?`,
      [intercambioId]
    );

    res.json({ message: 'Intercambio aprobado por el administrador' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al aprobar intercambio' });
  }
};
