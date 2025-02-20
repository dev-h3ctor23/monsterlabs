-- Insertar en la tabla Usuario
INSERT IGNORE INTO Usuario (nombre_usuario, correo, contrasena, nombre_tipo) VALUES ('rgomez', 'rgomez@gmail.com', 'Pass123', 'padre');
INSERT IGNORE INTO Usuario (nombre_usuario, correo, contrasena, nombre_tipo) VALUES ('hchango', 'hchango@hotmail.com', 'Hc1234', 'padre');
INSERT IGNORE INTO Usuario (nombre_usuario, correo, contrasena, nombre_tipo) VALUES ('mhuamani', 'mhuamani@gmail.com', 'Mir123', 'padre');
INSERT IGNORE INTO Usuario (nombre_usuario, correo, contrasena, nombre_tipo) VALUES ('nchile', 'natalia.chile@gmail.com', 'Nat123', 'monitor');
INSERT IGNORE INTO Usuario (nombre_usuario, correo, contrasena, nombre_tipo) VALUES ('mperu', 'melissa.peru@hotmail.com', 'Mel456', 'monitor');
INSERT IGNORE INTO Usuario (nombre_usuario, correo, contrasena, nombre_tipo) VALUES ('svillanueva', 'sara.villanueva@gmail.com', 'Sara789', 'monitor');
INSERT IGNORE INTO Usuario (nombre_usuario, correo, contrasena, nombre_tipo) VALUES ('irinconbello', 'irene.rincon@hotmail.com', 'Irene123', 'monitor');
INSERT IGNORE INTO Usuario (nombre_usuario, correo, contrasena, nombre_tipo) VALUES ('admin', 'admin@gmail.com', 'Admin1', 'admin');
INSERT IGNORE INTO Usuario (nombre_usuario, correo, contrasena, nombre_tipo) VALUES ('sruiz', 'padre3@monsterlabs.com', 'password3', 'padre');
INSERT IGNORE INTO Usuario (nombre_usuario, correo, contrasena, nombre_tipo) VALUES ('ifernandez', 'padre4@monsterlabs.com', 'password4', 'padre');
INSERT IGNORE INTO Usuario (nombre_usuario, correo, contrasena, nombre_tipo) VALUES ('rsantos', 'padre5@monsterlabs.com', 'password5', 'padre');
INSERT IGNORE INTO Usuario (nombre_usuario, correo, contrasena, nombre_tipo) VALUES ('sramirez', 'padre6@monsterlabs.com', 'password6', 'padre');
INSERT IGNORE INTO Usuario (nombre_usuario, correo, contrasena, nombre_tipo) VALUES ('ahernandez', 'padre7@monsterlabs.com', 'password7', 'padre');
INSERT IGNORE INTO Usuario (nombre_usuario, correo, contrasena, nombre_tipo) VALUES ('mnavarro', 'padre8@monsterlabs.com', 'password8', 'padre');
INSERT IGNORE INTO Usuario (nombre_usuario, correo, contrasena, nombre_tipo) VALUES ('gcastro', 'padre9@monsterlabs.com', 'password9', 'padre');
INSERT IGNORE INTO Usuario (nombre_usuario, correo, contrasena, nombre_tipo) VALUES ('lmendoza', 'padre10@monsterlabs.com', 'password10', 'padre');

-- Insertar en la tabla Padre
INSERT IGNORE INTO Padre (dni_padre, nombre, apellido, numero_telefono, id_usuario) VALUES ('12345678A', 'Ricardo', 'Gomez', '999888777', (SELECT id_usuario FROM Usuario WHERE nombre_usuario = 'rgomez'));
INSERT IGNORE INTO Padre (dni_padre, nombre, apellido, numero_telefono, id_usuario) VALUES ('87654321B', 'Hector', 'Chango', '999888776', (SELECT id_usuario FROM Usuario WHERE nombre_usuario = 'hchango'));
INSERT IGNORE INTO Padre (dni_padre, nombre, apellido, numero_telefono, id_usuario) VALUES ('56781234C', 'Miryam', 'Huamani', '999888775', (SELECT id_usuario FROM Usuario WHERE nombre_usuario = 'mhuamani'));

INSERT IGNORE INTO Padre (dni_padre, nombre, apellido, numero_telefono, id_usuario) 
VALUES ('12398745D', 'Santiago', 'Ruiz', '600888777', (SELECT id_usuario FROM Usuario WHERE nombre_usuario = 'sruiz'));

INSERT IGNORE INTO Padre (dni_padre, nombre, apellido, numero_telefono, id_usuario) 
VALUES ('32178954E', 'Isabel', 'Fernández', '600222333', (SELECT id_usuario FROM Usuario WHERE nombre_usuario = 'ifernandez'));

INSERT IGNORE INTO Padre (dni_padre, nombre, apellido, numero_telefono, id_usuario) 
VALUES ('78965412F', 'Ricardo', 'Santos', '600444555', (SELECT id_usuario FROM Usuario WHERE nombre_usuario = 'rsantos'));

INSERT IGNORE INTO Padre (dni_padre, nombre, apellido, numero_telefono, id_usuario) 
VALUES ('45632187G', 'Sofía', 'Ramírez', '600666777', (SELECT id_usuario FROM Usuario WHERE nombre_usuario = 'sramirez'));

INSERT IGNORE INTO Padre (dni_padre, nombre, apellido, numero_telefono, id_usuario) 
VALUES ('98712365H', 'Andrés', 'Hernández', '600999888', (SELECT id_usuario FROM Usuario WHERE nombre_usuario = 'ahernandez'));

INSERT IGNORE INTO Padre (dni_padre, nombre, apellido, numero_telefono, id_usuario) 
VALUES ('56473829I', 'Mónica', 'Navarro', '600111999', (SELECT id_usuario FROM Usuario WHERE nombre_usuario = 'mnavarro'));

INSERT IGNORE INTO Padre (dni_padre, nombre, apellido, numero_telefono, id_usuario) 
VALUES ('29183746J', 'Gabriel', 'Castro', '600555111', (SELECT id_usuario FROM Usuario WHERE nombre_usuario = 'gcastro'));

INSERT IGNORE INTO Padre (dni_padre, nombre, apellido, numero_telefono, id_usuario) 
VALUES ('83746591K', 'Laura', 'Mendoza', '600777000', (SELECT id_usuario FROM Usuario WHERE nombre_usuario = 'lmendoza'));



-- Insertar en la tabla Monitor
INSERT IGNORE INTO Monitor (dni_monitor, nombre, apellido, numero_telefono, id_usuario) VALUES ('11111111A', 'Natalia', 'Chile', '987654321', (SELECT id_usuario FROM Usuario WHERE nombre_usuario = 'nchile'));
INSERT IGNORE INTO Monitor (dni_monitor, nombre, apellido, numero_telefono, id_usuario) VALUES ('11111112B', 'Melissa', 'Peru', '987654322', (SELECT id_usuario FROM Usuario WHERE nombre_usuario = 'mperu'));
INSERT IGNORE INTO Monitor (dni_monitor, nombre, apellido, numero_telefono, id_usuario) VALUES ('11111113C', 'Sara', 'Villanueva', '987654323', (SELECT id_usuario FROM Usuario WHERE nombre_usuario = 'svillanueva'));
INSERT IGNORE INTO Monitor (dni_monitor, nombre, apellido, numero_telefono, id_usuario) VALUES ('11111114D', 'IRENE DEL RINCON', 'BELLO', '987654324', (SELECT id_usuario FROM Usuario WHERE nombre_usuario = 'irinconbello'));

-- Insertar en la tabla Administrador
INSERT IGNORE INTO Administrador (dni_admin, id_usuario) VALUES ('99999999Z', (SELECT id_usuario FROM Usuario WHERE nombre_usuario = 'admin'));

-- Insertar en la tabla Niño
INSERT IGNORE INTO Nino (nombre, apellido, fecha_nacimiento, nombre_estado, dni_padre) VALUES ('Lucas', 'Gomez', '2015-05-10', 'activo', '12345678A');
INSERT IGNORE INTO Nino (nombre, apellido, fecha_nacimiento, nombre_estado, dni_padre) VALUES ('Mia', 'Gomez', '2017-03-22', 'activo', '12345678A');
INSERT IGNORE INTO Nino (nombre, apellido, fecha_nacimiento, nombre_estado, dni_padre) VALUES ('Juan', 'Chango', '2014-08-15', 'activo', '87654321B');
INSERT IGNORE INTO Nino (nombre, apellido, fecha_nacimiento, nombre_estado, dni_padre) VALUES ('Sofia', 'Chango', '2016-09-30', 'activo', '87654321B');
INSERT IGNORE INTO Nino (nombre, apellido, fecha_nacimiento, nombre_estado, dni_padre) VALUES ('Pedro', 'Huamani', '2013-12-01', 'activo', '56781234C');
INSERT IGNORE INTO Nino (nombre, apellido, fecha_nacimiento, nombre_estado, dni_padre) VALUES ('Valeria', 'Huamani', '2018-02-11', 'activo', '56781234C');

-- Insertar en la tabla Guardian
INSERT IGNORE INTO Guardian (dni_guardian, nombre, apellido, telefono) VALUES ('77777777A', 'Carlos', 'Fernandez', '666555444');
INSERT IGNORE INTO Guardian (dni_guardian, nombre, apellido, telefono) VALUES ('77777777B', 'Ana', 'Martinez', '666555445');

-- Insertar en la tabla GuardianNino
INSERT IGNORE INTO GuardianNino (relacion, dni_nino, dni_guardian) VALUES ('tio', '55555555A', '77777777A');
INSERT IGNORE INTO GuardianNino (relacion, dni_nino, dni_guardian) VALUES ('abuela', '55555555A', '77777777B');
INSERT IGNORE INTO GuardianNino (relacion, dni_nino, dni_guardian) VALUES ('tio', '55555556A', '77777777A');
INSERT IGNORE INTO GuardianNino (relacion, dni_nino, dni_guardian) VALUES ('tia', '55555557A', '77777777B');


-- Insertar en la tabla Cronograma
-- Inserta el primer cronograma SOLO SI la tabla está vacía
INSERT IGNORE INTO Cronograma (fecha, hora_inicio, hora_fin, descripcion, id_usuario)
SELECT '2025-01-10', '09:00:00', '12:00:00', 'Actividades matutinas para niños',
       (SELECT id_usuario FROM Usuario WHERE nombre_usuario = 'rgomez')
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM Cronograma LIMIT 1);

-- Inserta el segundo cronograma SOLO SI la tabla sigue vacía (o sea, si no se insertó nada antes)
INSERT IGNORE INTO Cronograma (fecha, hora_inicio, hora_fin, descripcion, id_usuario)
SELECT '2025-01-11', '15:00:00', '17:00:00', 'Clase de danza',
       (SELECT id_usuario FROM Usuario WHERE nombre_usuario = 'nchile')
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM Cronograma LIMIT 1);

-- Inserta el tercer cronograma SOLO SI la tabla sigue vacía
INSERT IGNORE INTO Cronograma (fecha, hora_inicio, hora_fin, descripcion, id_usuario)
SELECT '2025-01-12', '10:00:00', '13:00:00', 'Manualidades y arte',
       (SELECT id_usuario FROM Usuario WHERE nombre_usuario = 'mperu')
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM Cronograma LIMIT 1);

-- Insertar en la tabla Actividad-- Insertar en la tabla Actividad (solo si no hay NINGUNA fila)
INSERT IGNORE INTO Actividad (nombre_actividad, dni_monitor)
SELECT 'Danza Moderna', '11111111A'
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM Actividad LIMIT 1);

INSERT IGNORE INTO Actividad (nombre_actividad, dni_monitor)
SELECT 'Pintura Infantil', '11111112B'
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM Actividad LIMIT 1);

INSERT IGNORE INTO Actividad (nombre_actividad, dni_monitor)
SELECT 'Teatro Infantil', '11111113C'
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM Actividad LIMIT 1);

-- Insertar en la tabla ActividadNino
INSERT IGNORE INTO ActividadNino (id_actividad, dni_nino) VALUES (1, '55555555A'); 
INSERT IGNORE INTO ActividadNino (id_actividad, dni_nino) VALUES (1, '55555556A'); 
INSERT IGNORE INTO ActividadNino (id_actividad, dni_nino) VALUES (2, '55555557A'); 
INSERT IGNORE INTO ActividadNino (id_actividad, dni_nino) VALUES (3, '55555555B'); 

-- Insertar en la tabla CronogramaActividad
INSERT IGNORE INTO CronogramaActividad (id_cronograma, id_actividad, hora_asignada, duracion) 
VALUES (1, 1, '09:30:00', 60);  
INSERT IGNORE INTO CronogramaActividad (id_cronograma, id_actividad, hora_asignada, duracion) 
VALUES (1, 2, '10:30:00', 90); 
INSERT IGNORE INTO CronogramaActividad (id_cronograma, id_actividad, hora_asignada, duracion) 
VALUES (2, 1, '15:30:00', 90);  
INSERT IGNORE INTO CronogramaActividad (id_cronograma, id_actividad, hora_asignada, duracion) 
VALUES (3, 3, '11:00:00', 120); 

-- Insertar en la tabla Conversacion
INSERT IGNORE INTO Conversacion (fecha_creacion) VALUES ('2025-01-10');
INSERT IGNORE INTO Conversacion (fecha_creacion) VALUES ('2025-01-11');

-- Insertar en la tabla ParticipantesConversacion
INSERT IGNORE INTO ParticipantesConversacion (id_conversacion, id_usuario) 
VALUES (1, (SELECT id_usuario FROM Usuario WHERE nombre_usuario = 'rgomez'));
INSERT IGNORE INTO ParticipantesConversacion (id_conversacion, id_usuario) 
VALUES (1, (SELECT id_usuario FROM Usuario WHERE nombre_usuario = 'nchile'));
INSERT IGNORE INTO ParticipantesConversacion (id_conversacion, id_usuario) 
VALUES (2, (SELECT id_usuario FROM Usuario WHERE nombre_usuario = 'mperu'));
INSERT IGNORE INTO ParticipantesConversacion (id_conversacion, id_usuario) 
VALUES (2, (SELECT id_usuario FROM Usuario WHERE nombre_usuario = 'svillanueva'));

-- Insertar en la tabla FichaMedica
INSERT IGNORE INTO FichaMedica (alimentos_alergico, medicamentos_alergico, medicamentos_actuales, nombre_emergencia, telefono_emergencia, dni_nino) 
VALUES ('Ninguna', 'Penicilina', 'Ibuprofeno', 'Maria Gomez', '555123456', '55555555A');
INSERT IGNORE INTO FichaMedica (alimentos_alergico, medicamentos_alergico, medicamentos_actuales, nombre_emergencia, telefono_emergencia, dni_nino) 
VALUES ('Huevo, Leche', 'Ninguna', 'Antihistamínico', 'Juan Gomez', '555123457', '55555556A');
INSERT IGNORE INTO FichaMedica (alimentos_alergico, medicamentos_alergico, medicamentos_actuales, nombre_emergencia, telefono_emergencia, dni_nino) 
VALUES ('Fresas', 'Penicilina', 'Amoxicilina', 'Luisa Huamani', '555123458', '55555557A');
