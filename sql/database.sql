CREATE DATABASE IF NOT EXISTS monsterLabs;
USE monsterLabs;

-- Tabla Usuario
CREATE TABLE IF NOT EXISTS Usuario (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre_usuario VARCHAR(100) NOT NULL,
    correo VARCHAR(100) NOT NULL,
    contrasena VARCHAR(255) NOT NULL,
    nombre_tipo ENUM('padre', 'monitor', 'admin') NOT NULL
);

-- Tabla Grupo
CREATE TABLE IF NOT EXISTS Grupo (
    id_grupo INT AUTO_INCREMENT PRIMARY KEY,
    nombre_grupo VARCHAR(100) NOT NULL
);

-- Tabla Padre
CREATE TABLE IF NOT EXISTS Padre (
    id_padre INT AUTO_INCREMENT PRIMARY KEY,
    dni_padre VARCHAR(9) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    numero_telefono VARCHAR(13),
    id_usuario INT NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario) ON DELETE CASCADE
);

-- Tabla Monitor
CREATE TABLE IF NOT EXISTS Monitor (
    id_monitor INT AUTO_INCREMENT PRIMARY KEY,
    dni_monitor VARCHAR(9) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    numero_telefono VARCHAR(13),
    id_usuario INT NOT NULL,
    id_grupo INT NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_grupo) REFERENCES Grupo(id_grupo) ON DELETE CASCADE
);

-- Tabla Administrador
CREATE TABLE IF NOT EXISTS Administrador (
    id_admin INT AUTO_INCREMENT PRIMARY KEY,
    dni_admin VARCHAR(9) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    numero_telefono VARCHAR(13),
    id_usuario INT NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario) ON DELETE CASCADE
);

-- Tabla Niño
CREATE TABLE IF NOT EXISTS Nino (
    id_nino INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    periodo ENUM('semanal', 'mensual', 'trimestral') NOT NULL,
    estado ENUM('activo', 'inactivo') NOT NULL,
    id_grupo INT,
    id_padre INT NOT NULL,
    FOREIGN KEY (id_grupo) REFERENCES Grupo(id_grupo) ON DELETE SET NULL,
    FOREIGN KEY (id_padre) REFERENCES Padre(id_padre) ON DELETE CASCADE
);

-- Tabla Asistencia
CREATE TABLE IF NOT EXISTS Asistencia (
    id_asistencia INT AUTO_INCREMENT PRIMARY KEY,
    fecha DATE NOT NULL,
    id_nino INT NOT NULL,
    estado ENUM('asistio', 'ausente') NOT NULL,
    FOREIGN KEY (id_nino) REFERENCES Nino(id_nino) ON DELETE CASCADE
);

-- Tabla Pago
CREATE TABLE IF NOT EXISTS Pago (
    id_pago INT AUTO_INCREMENT PRIMARY KEY,
    nombre_tipo ENUM('transferencia', 'bizum', 'pagoCentro') NOT NULL,
    id_padre INT NOT NULL,
    FOREIGN KEY (id_padre) REFERENCES Padre(id_padre) ON DELETE CASCADE
);

-- Tabla Guardian
CREATE TABLE IF NOT EXISTS Guardian (
    id_guardian INT AUTO_INCREMENT PRIMARY KEY,
    dni_guardian VARCHAR(9) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    telefono VARCHAR(13)
);

-- Tabla GuardianNino
CREATE TABLE IF NOT EXISTS GuardianNino (
    id_relacion INT AUTO_INCREMENT PRIMARY KEY,
    relacion VARCHAR(50) NOT NULL,
    id_nino INT NOT NULL,
    id_guardian INT NOT NULL,
    FOREIGN KEY (id_nino) REFERENCES Nino(id_nino) ON DELETE CASCADE,
    FOREIGN KEY (id_guardian) REFERENCES Guardian(id_guardian) ON DELETE CASCADE
);

-- Tabla Actividad
CREATE TABLE IF NOT EXISTS Actividad (
    id_actividad INT AUTO_INCREMENT PRIMARY KEY,
    nombre_actividad VARCHAR(100) NOT NULL,
    descripcion TEXT NOT NULL
);

-- Tabla Cronograma
CREATE TABLE IF NOT EXISTS Cronograma (
    id_cronograma INT AUTO_INCREMENT PRIMARY KEY,
    fecha DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    id_actividad INT NOT NULL,
    id_grupo INT NOT NULL,
    FOREIGN KEY (id_actividad) REFERENCES Actividad(id_actividad) ON DELETE CASCADE,
    FOREIGN KEY (id_grupo) REFERENCES Grupo(id_grupo) ON DELETE CASCADE
);

-- Tabla FichaMedica
CREATE TABLE IF NOT EXISTS FichaMedica (
    id_ficha INT AUTO_INCREMENT PRIMARY KEY,
    alimentos_alergico TEXT,
    medicamentos_alergico TEXT,
    medicamentos_actuales TEXT,
    id_nino INT NOT NULL,
    FOREIGN KEY (id_nino) REFERENCES Nino(id_nino) ON DELETE CASCADE
);

-- Tabla Notificaciones
CREATE TABLE IF NOT EXISTS Notificaciones (
    id_notificacion INT AUTO_INCREMENT PRIMARY KEY,
    asunto VARCHAR(100) NOT NULL,
    descripcion VARCHAR(300) NOT NULL,
    fecha DATE NOT NULL,
    id_usuario INT NOT NULL, 
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario) ON DELETE CASCADE
);

-- Tabla PeriodoNino
CREATE TABLE IF NOT EXISTS PeriodoNino (
    id_periodo INT AUTO_INCREMENT PRIMARY KEY,
    fecha_inicio_periodo DATE NOT NULL,
    fecha_fin_periodo DATE NOT NULL,
    id_nino INT NOT NULL,
    FOREIGN KEY (id_nino) REFERENCES Nino(id_nino) ON DELETE CASCADE
);

-- Tabla Observaciones
CREATE TABLE IF NOT EXISTS Observaciones (
    id_observacion INT AUTO_INCREMENT PRIMARY KEY,
    observacion TEXT NOT NULL,
    id_nino INT NOT NULL, 
    FOREIGN KEY (id_nino) REFERENCES Nino(id_nino) ON DELETE CASCADE
);
