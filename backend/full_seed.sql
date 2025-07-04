CREATE DATABASE IF NOT EXISTS legajos_db;
USE legajos_db;

-- Tabla users
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  dni VARCHAR(20) UNIQUE NOT NULL,
  role ENUM('admin', 'personal') DEFAULT 'personal',
  coche_asignado VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla empleados
CREATE TABLE IF NOT EXISTS empleados (
  id VARCHAR(36) PRIMARY KEY,
  nombreApellido VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  dni VARCHAR(20) UNIQUE NOT NULL,
  puesto VARCHAR(100),
  telefono VARCHAR(50),
  coche VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla coches
CREATE TABLE IF NOT EXISTS coches (
  id VARCHAR(36) PRIMARY KEY,
  numero_coche VARCHAR(50) UNIQUE NOT NULL,
  empresa_id VARCHAR(36),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla francos
CREATE TABLE IF NOT EXISTS francos (
  id VARCHAR(36) PRIMARY KEY,
  empleado_id VARCHAR(36) NOT NULL,
  fecha DATE NOT NULL,
  estado ENUM('aprobado', 'pendiente', 'rechazado') DEFAULT 'pendiente',
  motivo VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (empleado_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabla intercambios_francos
CREATE TABLE IF NOT EXISTS intercambios_francos (
  id VARCHAR(36) PRIMARY KEY,
  franco_id VARCHAR(36) NOT NULL,
  cedido_por_id VARCHAR(36) NOT NULL,
  cedido_a_id VARCHAR(36) NOT NULL,
  estado ENUM('pendiente', 'aceptado', 'rechazado') DEFAULT 'pendiente',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (franco_id) REFERENCES francos(id) ON DELETE CASCADE,
  FOREIGN KEY (cedido_por_id) REFERENCES users(id),
  FOREIGN KEY (cedido_a_id) REFERENCES users(id)
);


-- Crear usuarios admin y empleados
INSERT INTO users (id, email, password, dni, role, coche_asignado) VALUES
(UUID(), 'admin@empresa.com', '$2b$10$jdBOCU1fTEbSHEqFBM6Nnu4JfiFfbyjDGElx/Pgo3GtSIC56V8u2a', '12345678', 'admin', NULL),
(UUID(), 'jorge@empresa.com', '$2b$10$jdBOCU1fTEbSHEqFBM6Nnu4JfiFfbyjDGElx/Pgo3GtSIC56V8u2a', '22334455', 'personal', '101'),
(UUID(), 'lucia@empresa.com', '$2b$10$jdBOCU1fTEbSHEqFBM6Nnu4JfiFfbyjDGElx/Pgo3GtSIC56V8u2a', '33445566', 'personal', '102');

-- Crear empleados
INSERT INTO empleados (id, nombreApellido, email, dni, puesto, telefono, coche) VALUES
(UUID(), 'Jorge Pérez', 'jorge@empresa.com', '22334455', 'Conductor', '1122334455', '101'),
(UUID(), 'Lucia Gómez', 'lucia@empresa.com', '33445566', 'Conductor', '2233445566', '102');

-- Crear coches
INSERT INTO coches (id, numero_coche, empresa_id) VALUES
(UUID(), '101', NULL),
(UUID(), '102', NULL);

-- Crear francos
INSERT INTO francos (id, empleado_id, fecha, estado, motivo) VALUES
(UUID(), (SELECT id FROM users WHERE email = 'jorge@empresa.com'), '2025-07-10', 'aprobado', 'Vacaciones'),
(UUID(), (SELECT id FROM users WHERE email = 'lucia@empresa.com'), '2025-07-15', 'pendiente', 'Trámite personal');

-- Crear intercambios
INSERT INTO intercambios_francos (id, franco_id, cedido_por_id, cedido_a_id, estado) VALUES
(UUID(), (SELECT id FROM francos WHERE motivo = 'Vacaciones'), (SELECT id FROM users WHERE email = 'jorge@empresa.com'), (SELECT id FROM users WHERE email = 'lucia@empresa.com'), 'pendiente');