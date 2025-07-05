// trades.controller.js
import { db } from "../config/db.js";

// ✅ Publicar un franco para intercambio
export const publicarFranco = async (req, res) => {
  const { francoId } = req.body;
  const empleadoId = req.user.id;

  try {
    // Verificar que el franco existe, pertenece al usuario y está pendiente o aprobado
    const [francos] = await db.query(
      `SELECT * FROM francos WHERE id = ? AND empleado_id = ? AND estado IN ('pendiente', 'aprobado')`,
      [francoId, empleadoId]
    );
    if (francos.length === 0) {
      return res.status(404).json({ message: "Franco no encontrado o no válido para publicar" });
    }

    // Actualizar estado a 'publicado'
    await db.query(
      `UPDATE francos SET estado = 'publicado' WHERE id = ?`,
      [francoId]
    );

    res.json({ message: "✅ Franco publicado para intercambio" });
  } catch (error) {
    console.error("❌ Error al publicar franco:", error);
    res.status(500).json({ message: "Error interno al publicar franco" });
  }
};

// ✅ Obtener todos los francos publicados por otros empleados
export const obtenerFrancosPublicados = async (req, res) => {
  const empleadoId = req.user.id;
  try {
    const [francos] = await db.query(
      `SELECT f.id, f.fecha, f.estado, u.email, u.dni, u.coche_asignado
       FROM francos f
       INNER JOIN users u ON f.empleado_id = u.id
       WHERE f.estado = 'publicado' AND f.empleado_id != ?`,
      [empleadoId]
    );

    res.json(francos);
  } catch (error) {
    console.error("❌ Error al obtener francos publicados:", error);
    res.status(500).json({ message: "Error interno al listar francos" });
  }
};

// ✅ Proponer intercambio
export const proponerIntercambio = async (req, res) => {
  const { francoPublicadoId, francoPropuestoId } = req.body;
  const solicitanteId = req.user.id;

  try {
    // Verificar que el franco propuesto pertenece al solicitante y está aprobado o pendiente
    const [francoPropio] = await db.query(
      `SELECT * FROM francos WHERE id = ? AND empleado_id = ? AND estado IN ('pendiente', 'aprobado')`,
      [francoPropuestoId, solicitanteId]
    );
    if (francoPropio.length === 0) {
      return res.status(400).json({ message: "El franco propuesto no es válido" });
    }

    // Verificar que el franco publicado existe y sigue publicado
    const [francoPublicado] = await db.query(
      `SELECT * FROM francos WHERE id = ? AND estado = 'publicado'`,
      [francoPublicadoId]
    );
    if (francoPublicado.length === 0) {
      return res.status(400).json({ message: "El franco publicado ya no está disponible" });
    }

    // Crear la propuesta
    await db.query(
      `INSERT INTO trades (id, franco_publicado_id, franco_propuesto_id, empleado_solicitante_id, estado, fecha_propuesta)
       VALUES (UUID(), ?, ?, ?, 'pendiente', NOW())`,
      [francoPublicadoId, francoPropuestoId, solicitanteId]
    );

    res.json({ message: "✅ Intercambio propuesto correctamente" });
  } catch (error) {
    console.error("❌ Error al proponer intercambio:", error);
    res.status(500).json({ message: "Error interno al proponer intercambio" });
  }
};

// ✅ Responder intercambio (aprobar o rechazar)
export const responderIntercambio = async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;
  const empleadoId = req.user.id;
  const userRole = req.user.role;

  if (!['aprobado', 'rechazado'].includes(estado)) {
    return res.status(400).json({ message: "Estado inválido" });
  }

  try {
    const connection = await db.getConnection();
    await connection.beginTransaction();

    // Obtener la propuesta para bloqueo
    const [trades] = await connection.query(
      `SELECT * FROM trades WHERE id = ? FOR UPDATE`,
      [id]
    );
    if (trades.length === 0) {
      await connection.release();
      return res.status(404).json({ message: "Solicitud no encontrada" });
    }
    const trade = trades[0];

    if (trade.estado !== 'pendiente') {
      await connection.release();
      return res.status(400).json({ message: "Solicitud ya procesada" });
    }

    // 🔥 Si no es admin, verificar que sea el dueño del franco publicado
    if (userRole !== "admin") {
      const [francoPublicado] = await connection.query(
        `SELECT * FROM francos WHERE id = ? AND empleado_id = ? FOR UPDATE`,
        [trade.franco_publicado_id, empleadoId]
      );
      if (francoPublicado.length === 0) {
        await connection.release();
        return res.status(403).json({ message: "No autorizado para responder" });
      }
    }

    if (estado === 'aprobado') {
      // Intercambiar empleados en los dos francos
      await connection.query(
        `UPDATE francos SET empleado_id = ? WHERE id = ?`,
        [trade.empleado_solicitante_id, trade.franco_publicado_id]
      );
      await connection.query(
        `UPDATE francos SET empleado_id = ? WHERE id = ?`,
        [empleadoId, trade.franco_propuesto_id]
      );

      // Marcar ambos francos como intercambiados
      await connection.query(
        `UPDATE francos SET estado = 'intercambiado' WHERE id IN (?, ?)`,
        [trade.franco_publicado_id, trade.franco_propuesto_id]
      );
    }

    // Actualizar estado del trade
    await connection.query(
      `UPDATE trades SET estado = ?, fecha_respuesta = NOW() WHERE id = ?`,
      [estado, id]
    );

    await connection.commit();
    await connection.release();

    res.json({ message: `✅ Solicitud de intercambio ${estado}` });
  } catch (error) {
    console.error("❌ Error al responder intercambio:", error);
    res.status(500).json({ message: "Error interno al responder la solicitud" });
  }
};

// ✅ Listar mis trades (propuestas enviadas o recibidas)
export const listarMisTrades = async (req, res) => {
  const empleadoId = req.user.id;
  try {
    const [trades] = await db.query(
      `SELECT t.id, t.estado, t.fecha_propuesta, t.fecha_respuesta,
              fp.fecha AS fecha_franco_publicado,
              fp.empleado_id AS duenio_franco_publicado,
              u1.email AS publicador_email,
              frp.fecha AS fecha_franco_propuesto,
              frp.empleado_id AS duenio_franco_propuesto,
              u2.email AS proponente_email
       FROM trades t
       INNER JOIN francos fp ON t.franco_publicado_id = fp.id
       INNER JOIN users u1 ON fp.empleado_id = u1.id
       INNER JOIN francos frp ON t.franco_propuesto_id = frp.id
       INNER JOIN users u2 ON frp.empleado_id = u2.id
       WHERE fp.empleado_id = ? OR t.empleado_solicitante_id = ?`,
      [empleadoId, empleadoId]
    );
    res.json(trades);
  } catch (error) {
    console.error("❌ Error al listar trades:", error);
    res.status(500).json({ message: "Error interno al listar trades" });
  }
};
