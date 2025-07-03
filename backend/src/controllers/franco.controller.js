import { db } from '../config/db.js';
import { v4 as uuidv4 } from 'uuid';

// ✅ Obtener francos del usuario actual
export const getFrancosByEmployee = async (req, res) => {
  try {
    const userId = req.user.id;

    const [rows] = await db.query(
      `SELECT * FROM francos WHERE empleado_id = ?`,
      [userId]
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener francos' });
  }
};

// ✅ Empleado solicita un franco
export const requestFranco = async (req, res) => {
  const { fecha, motivo } = req.body;

  try {
    const id = uuidv4();

    await db.query(
      `INSERT INTO francos (id, empleado_id, fecha, estado, motivo)
       VALUES (?, ?, ?, 'pendiente', ?)`,
      [id, req.user.id, fecha, motivo]
    );

    res.status(201).json({ message: 'Franco solicitado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al solicitar franco' });
  }
};

// ✅ Admin asigna franco manualmente
export const adminAssignFranco = async (req, res) => {
  const { empleado_id, fecha, motivo } = req.body;

  try {
    const id = uuidv4();

    await db.query(
      `INSERT INTO francos (id, empleado_id, fecha, estado, motivo)
       VALUES (?, ?, ?, 'aprobado', ?)`,
      [id, empleado_id, fecha, motivo]
    );

    res.status(201).json({ message: 'Franco asignado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al asignar franco' });
  }
};
