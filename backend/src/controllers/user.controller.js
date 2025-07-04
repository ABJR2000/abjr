import { db } from '../config/db.js';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

export const createUser = async (req, res) => {
  const { email, password, dni, nombreApellido, puesto, telefono, coche } = req.body;

  try {
    // ✅ Verificar si email o DNI ya existen
    const [existing] = await db.query(
      'SELECT * FROM users WHERE email = ? OR dni = ?',
      [email, dni]
    );
    if (existing.length > 0) {
      return res.status(400).json({ message: 'El email o DNI ya están registrados' });
    }

    // ✅ Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);
    const id = uuidv4();

    // ✅ Insertar en tabla users
    await db.query(
      `INSERT INTO users (id, email, password, dni, role, coche_asignado)
       VALUES (?, ?, ?, ?, 'personal', ?)`,
      [id, email, hashedPassword, dni, coche]
    );

    // ✅ Insertar en tabla empleados
    await db.query(
      `INSERT INTO empleados (id, nombreApellido, email, dni, puesto, telefono, coche)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, nombreApellido, email, dni, puesto, telefono, coche]
    );

    console.log(`✅ Usuario ${email} creado con éxito`);
    res.status(201).json({ message: 'Usuario creado exitosamente' });
  } catch (error) {
    console.error('❌ Error al crear usuario:', error);
    res.status(500).json({ message: 'Error al crear usuario' });
  }
};

export const getEmployeeProfile = async (req, res) => {
  const userId = req.user.id;
  try {
    const [rows] = await db.query(
      `SELECT e.nombreApellido, e.email, e.dni, e.puesto, e.telefono, e.coche
       FROM empleados e WHERE e.id = ?`,
      [userId]
    );
    if (rows.length === 0)
      return res.status(404).json({ message: 'Empleado no encontrado' });

    res.json(rows[0]);
  } catch (err) {
    console.error('❌ Error al obtener perfil:', err);
    res.status(500).json({ message: 'Error en servidor' });
  }
};
