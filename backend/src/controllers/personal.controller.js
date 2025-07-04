// src/controllers/personal.controller.js
import { db } from "../config/db.js";

export const getPersonalProfile = async (req, res) => {
  try {
    // ✅ Solo obtener datos del usuario actual
    const [user] = await db.query(
      `SELECT dni, email, telefono, coche_asignado
       FROM users
       WHERE id = ?`,
      [req.user.id]
    );

    if (!user || user.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // ✅ Obtener vacaciones de este usuario
    const [vacaciones] = await db.query(
      `SELECT id, fecha_inicio, fecha_fin, estado
       FROM vacaciones
       WHERE empleado_id = ?`,
      [req.user.id]
    );

    // Responder con datos y vacaciones
    res.json({
      dni: user[0].dni,
      email: user[0].email,
      telefono: user[0].telefono,
      coche_asignado: user[0].coche_asignado,
      vacaciones,
    });
  } catch (err) {
    console.error("Error al obtener perfil:", err);
    res.status(500).json({ message: "Error al obtener el perfil" });
  }
};
