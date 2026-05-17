-- Crear tabla de empleados
CREATE TABLE IF NOT EXISTS empleados (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    telefono VARCHAR(20),
    rol VARCHAR(50) DEFAULT 'Empleado',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de turnos
CREATE TABLE IF NOT EXISTS turnos (
    id SERIAL PRIMARY KEY,
    empleado VARCHAR(100) NOT NULL,
    fecha DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    tipo VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar datos de ejemplo
INSERT INTO empleados (nombre, email, telefono, rol) VALUES
('Ana García', 'ana@empresa.com', '666111222', 'Administrador'),
('Carlos López', 'carlos@empresa.com', '666333444', 'Empleado'),
('María Martínez', 'maria@empresa.com', '666555666', 'Empleado');

INSERT INTO turnos (empleado, fecha, hora_inicio, hora_fin, tipo) VALUES
('Ana García', '2024-01-20', '09:00', '17:00', 'Mañana'),
('Carlos López', '2024-01-20', '14:00', '22:00', 'Tarde');