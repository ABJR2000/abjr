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