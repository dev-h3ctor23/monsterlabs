CREATE DATABASE IF NOT EXISTS monsterLabs;

USE monsterLabs;

CREATE TABLE IF NOT EXISTS Usuario (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre_usuario VARCHAR(100) UNIQUE NOT NULL,
    correo VARCHAR(100) UNIQUE NOT NULL,
    contrasena VARCHAR(255) NOT NULL,
    nombre_tipo ENUM('padre', 'monitor', 'admin') NOT NULL
);

CREATE TABLE IF NOT EXISTS Monitor (
    id_monitor INT AUTO_INCREMENT PRIMARY KEY,
    dni_monitor VARCHAR(20) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    numero_telefono VARCHAR(20),
    id_usuario INT NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario)
);

CREATE TABLE IF NOT EXISTS Padre (
    id_padre INT AUTO_INCREMENT PRIMARY KEY,
    dni_padre VARCHAR(20) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    numero_telefono VARCHAR(20),
    id_usuario INT NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario)
);

CREATE TABLE IF NOT EXISTS Pago (
    id_pago INT AUTO_INCREMENT PRIMARY KEY,
    nombre_tipo ENUM('transferencia', 'bizum', 'pagoCentro') NOT NULL,
    id_padre INT NOT NULL,
    FOREIGN KEY (id_padre) REFERENCES Padre(id_padre)
);

CREATE TABLE IF NOT EXISTS Nino (
    id_nino INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    nombre_estado ENUM('activo', 'inactivo') NOT NULL,
    id_padre INT NOT NULL,
    FOREIGN KEY (id_padre) REFERENCES Padre(id_padre)
);

CREATE TABLE IF NOT EXISTS Administrador (
    id_admin INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario)
);

CREATE TABLE IF NOT EXISTS Guardian (
    id_guardian INT AUTO_INCREMENT PRIMARY KEY,
    dni_guardian VARCHAR(20) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    telefono VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS GuardianNino (
    id_relacion INT AUTO_INCREMENT PRIMARY KEY,
    relacion VARCHAR(50) NOT NULL,
    id_nino INT NOT NULL,
    id_guardian INT NOT NULL,
    FOREIGN KEY (id_nino) REFERENCES Nino(id_nino),
    FOREIGN KEY (id_guardian) REFERENCES Guardian(id_guardian)
);

CREATE TABLE IF NOT EXISTS Cronograma (
    id_cronograma INT AUTO_INCREMENT PRIMARY KEY,
    fecha DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    descripcion TEXT NOT NULL,
    id_usuario INT NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario)
);

CREATE TABLE IF NOT EXISTS Actividad (
    id_actividad INT AUTO_INCREMENT PRIMARY KEY,
    nombre_actividad VARCHAR(100) NOT NULL,
    id_monitor INT,
    FOREIGN KEY (id_monitor) REFERENCES Monitor(id_monitor)
);

CREATE TABLE IF NOT EXISTS ActividadNino (
    id_actividad INT NOT NULL,
    id_nino INT NOT NULL,
    PRIMARY KEY (id_actividad, id_nino),
    FOREIGN KEY (id_actividad) REFERENCES Actividad(id_actividad),
    FOREIGN KEY (id_nino) REFERENCES Nino(id_nino)
);

CREATE TABLE IF NOT EXISTS CronogramaActividad (
    id_cronograma INT NOT NULL,
    id_actividad INT NOT NULL,
    hora_asignada TIME NOT NULL,
    duracion INT NOT NULL,
    PRIMARY KEY (id_cronograma, id_actividad),
    FOREIGN KEY (id_cronograma) REFERENCES Cronograma(id_cronograma),
    FOREIGN KEY (id_actividad) REFERENCES Actividad(id_actividad)
);

CREATE TABLE IF NOT EXISTS Conversacion (
    id_conversacion INT AUTO_INCREMENT PRIMARY KEY,
    fecha_creacion DATE NOT NULL
);

CREATE TABLE IF NOT EXISTS ParticipantesConversacion (
    id_conversacion INT NOT NULL,
    id_usuario INT NOT NULL,
    PRIMARY KEY (id_conversacion, id_usuario),
    FOREIGN KEY (id_conversacion) REFERENCES Conversacion(id_conversacion),
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario)
);

CREATE TABLE IF NOT EXISTS FichaMedica (
    id_ficha INT AUTO_INCREMENT PRIMARY KEY,
    alimentos_alergico TEXT,
    medicamentos_alergico TEXT,
    medicamentos_actuales TEXT,
    nombre_emergencia VARCHAR(50),
    telefono_emergencia VARCHAR(20),
    id_nino INT NOT NULL,
    FOREIGN KEY (id_nino) REFERENCES Nino(id_nino)
);