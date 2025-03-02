-- Insertar en la tabla Usuario
INSERT INTO Usuario (nombre_usuario, correo, contrasena, nombre_tipo) VALUES
('rgomez', 'rgomez@gmail.com', 'Pass123', 'padre'),
('hchango', 'hchango@hotmail.com', 'Hc1234', 'padre'),
('mhuamani', 'mhuamani@gmail.com', 'Mir123', 'padre'),
('nchile', 'natalia.chile@gmail.com', 'Nat123', 'monitor'),
('mperu', 'melissa.peru@hotmail.com', 'Mel456', 'monitor'),
('svillanueva', 'sara.villanueva@gmail.com', 'Sara789', 'monitor'),
('irinconbello', 'irene.rincon@hotmail.com', 'Irene123', 'monitor'),
('admin', 'admin@gmail.com', 'Admin1', 'admin'),
('sruiz', 'padre3@monsterlabs.com', 'password3', 'padre'),
('ifernandez', 'padre4@monsterlabs.com', 'password4', 'padre'),
('rsantos', 'padre5@monsterlabs.com', 'password5', 'padre'),
('sramirez', 'padre6@monsterlabs.com', 'password6', 'padre'),
('ahernandez', 'padre7@monsterlabs.com', 'password7', 'padre'),
('mnavarro', 'padre8@monsterlabs.com', 'password8', 'padre'),
('gcastro', 'padre9@monsterlabs.com', 'password9', 'padre'),
('lmendoza', 'padre10@monsterlabs.com', 'password10', 'padre');

-- Insertar en la tabla Grupo
INSERT INTO Grupo (nombre_grupo) VALUES
('Grupo A'),
('Grupo B'),
('Grupo C'),
('Grupo D'),
('Grupo E');

-- Insertar en la tabla Monitor
INSERT INTO Monitor (dni_monitor, nombre, apellido, numero_telefono, id_usuario, id_grupo) VALUES
('11111111A', 'Natalia', 'Chile', '987654321', (SELECT id_usuario FROM Usuario WHERE nombre_usuario = 'nchile'), 1),
('11111112B', 'Melissa', 'Peru', '987654322', (SELECT id_usuario FROM Usuario WHERE nombre_usuario = 'mperu'), 2),
('11111113C', 'Sara', 'Villanueva', '987654323', (SELECT id_usuario FROM Usuario WHERE nombre_usuario = 'svillanueva'), 3),
('11111114D', 'IRENE DEL RINCON', 'BELLO', '987654324', (SELECT id_usuario FROM Usuario WHERE nombre_usuario = 'irinconbello'), 4);

-- Insertar en la tabla Padre
INSERT INTO Padre (dni_padre, nombre, apellido, numero_telefono, id_usuario) VALUES
('12345678A', 'Ricardo', 'Gomez', '999888777', (SELECT id_usuario FROM Usuario WHERE nombre_usuario = 'rgomez')),
('87654321B', 'Hector', 'Chango', '999888776', (SELECT id_usuario FROM Usuario WHERE nombre_usuario = 'hchango')),
('56781234C', 'Miryam', 'Huamani', '999888775', (SELECT id_usuario FROM Usuario WHERE nombre_usuario = 'mhuamani')),
('12398745D', 'Santiago', 'Ruiz', '600888777', (SELECT id_usuario FROM Usuario WHERE nombre_usuario = 'sruiz')),
('32178954E', 'Isabel', 'Fernández', '600222333', (SELECT id_usuario FROM Usuario WHERE nombre_usuario = 'ifernandez')),
('78965412F', 'Ricardo', 'Santos', '600444555', (SELECT id_usuario FROM Usuario WHERE nombre_usuario = 'rsantos')),
('45632187G', 'Sofía', 'Ramírez', '600666777', (SELECT id_usuario FROM Usuario WHERE nombre_usuario = 'sramirez')),
('98712365H', 'Andrés', 'Hernández', '600999888', (SELECT id_usuario FROM Usuario WHERE nombre_usuario = 'ahernandez')),
('56473829I', 'Mónica', 'Navarro', '600111999', (SELECT id_usuario FROM Usuario WHERE nombre_usuario = 'mnavarro')),
('29183746J', 'Gabriel', 'Castro', '600555111', (SELECT id_usuario FROM Usuario WHERE nombre_usuario = 'gcastro')),
('83746591K', 'Laura', 'Mendoza', '600777000', (SELECT id_usuario FROM Usuario WHERE nombre_usuario = 'lmendoza'));

-- Insertar en la tabla Administrador
INSERT INTO Administrador (dni_admin, nombre, apellido, numero_telefono, id_usuario) VALUES
('11111111A', 'Carlos', 'Martinez', '700111111', (SELECT id_usuario FROM Usuario WHERE nombre_usuario = 'admin'));

-- Insertar en la tabla Niño
-- Insertar en la tabla Niño
INSERT INTO Nino (nombre, apellido, fecha_nacimiento, periodo, estado, id_grupo, id_padre) VALUES
('Lucas', 'Gomez', '2015-05-10', 'semanal', 'activo', 1, 1),
('Mia', 'Gomez', '2017-03-22', 'mensual', 'activo', 2, 1),
('Juan', 'Chango', '2014-08-15', 'trimestral', 'activo', 3, 2),
('Sofia', 'Chango', '2016-09-30', 'mensual', 'activo', 4, 2),
('Pedro', 'Huamani', '2013-12-01', 'semanal', 'activo', 5, 3),
('Valeria', 'Huamani', '2018-02-11', 'mensual', 'activo', 1, 3),
('Carlos', 'Ruiz', '2015-06-15', 'trimestral', 'activo', 2, 4),
('Ana', 'Fernández', '2014-03-22', 'mensual', 'activo', 3, 5),
('Juan', 'Santos', '2016-07-10', 'semanal', 'activo', 4, 6),
('Maria', 'Ramírez', '2017-02-28', 'mensual', 'activo', 5, 7),
('Pedro', 'Hernández', '2016-11-05', 'trimestral', 'activo', 1, 8),
('Lucia', 'Navarro', '2018-09-11', 'mensual', 'activo', 2, 9),
('Diego', 'Castro', '2015-04-05', 'semanal', 'activo', 3, 10),
('Sofia', 'Mendoza', '2017-01-20', 'mensual', 'activo', 4, 11);

INSERT INTO Guardian (dni_guardian, nombre, apellido, telefono) VALUES
('11223344D', 'Elena', 'Sanchez', '600777888'),
('22334455E', 'Roberto', 'Garcia', '600999000');

-- Insertar en la tabla GuardianNino
INSERT INTO GuardianNino (relacion, id_nino, id_guardian) VALUES
('abuela', 1, 1),
('tío', 2, 2),
('tutor', 3, 1),
('tutor', 4, 2);


INSERT IGNORE INTO Actividad (nombre_actividad, descripcion) VALUES ('Presentacion Monster', 'Esta actividad se realizará en el aula, donde los monitores darán la bienvenida a los niños y niñas. Se les invita a acomodarse en semicírculo en el suelo, junto al narrador de cuentos. El narrador contará la historia de la creación de Monster a los niños y niñas.');
INSERT IGNORE INTO Actividad (nombre_actividad, descripcion) VALUES ('Super Burbujas de Colores', 'Actividad creativa con burbujas y colorantes para experimentos visuales.');
INSERT IGNORE INTO Actividad (nombre_actividad, descripcion) VALUES ('Pasta Monster', 'Elaboración de pasta comestible con formas monstruosas.');
INSERT IGNORE INTO Actividad (nombre_actividad, descripcion) VALUES ('Super Slime', 'La actividad se llevará a cabo en el patio central, brindando a los niños y niñas un espacio amplio y cómodo para expresarse libremente. Antes de comenzar, se presentarán los materiales y se formularán preguntas para activar sus conocimientos previos. Luego, se les animará a crear un slime gigante de manera colaborativa, asegurando que todos participen. Al finalizar, se pondrá música para enriquecer la experiencia, permitiendo que los niños y niñas manipulen el slime mientras realizan movimientos con sus extremidades.');
INSERT IGNORE INTO Actividad (nombre_actividad, descripcion) VALUES ('Actividad Pasivo Monter', 'Actividad de relajación y creatividad en silencio con temática Monster.');
INSERT IGNORE INTO Actividad (nombre_actividad, descripcion) VALUES ('Circuito Activo Monster', 'Circuito deportivo inspirado en desafíos del mundo Monster.');


    INSERT INTO FichaMedica (alimentos_alergico, medicamentos_alergico, medicamentos_actuales, id_nino) VALUES
    ('Maní', 'Penicilina', 'Ninguno', 1),
    ('Gluten', 'Ninguno', 'Ibuprofeno', 2),
    ('Lactosa', 'Ninguno', 'Paracetamol', 3),
    ('Ninguno', 'Ninguno', 'Ninguno', 4);


-- Insertar actividades en el cronograma para la primera semana (2 de junio de 2024 al 8 de junio de 2024)
INSERT INTO Cronograma (fecha, hora_inicio, hora_fin, id_actividad, id_grupo) VALUES
-- Lunes 3 de junio de 2024
('2024-06-03', '09:00:00', '10:00:00', 1, 1), -- Presentacion Monster para Grupo A
('2024-06-03', '10:00:00', '11:00:00', 2, 2), -- Super Burbujas de Colores para Grupo B
('2024-06-03', '11:00:00', '12:00:00', 3, 3), -- Pasta Monster para Grupo C
('2024-06-03', '12:00:00', '13:00:00', 4, 4), -- Super Slime para Grupo D
('2024-06-03', '13:00:00', '14:00:00', 5, 5), -- Actividad Pasivo Monster para Grupo E
('2024-06-03', '14:00:00', '15:00:00', 6, 1), -- Circuito Activo Monster para Grupo A

-- Martes 4 de junio de 2024
('2024-06-04', '09:00:00', '10:00:00', 2, 1), -- Super Burbujas de Colores para Grupo A
('2024-06-04', '10:00:00', '11:00:00', 3, 2), -- Pasta Monster para Grupo B
('2024-06-04', '11:00:00', '12:00:00', 4, 3), -- Super Slime para Grupo C
('2024-06-04', '12:00:00', '13:00:00', 5, 4), -- Actividad Pasivo Monster para Grupo D
('2024-06-04', '13:00:00', '14:00:00', 6, 5), -- Circuito Activo Monster para Grupo E
('2024-06-04', '14:00:00', '15:00:00', 1, 2), -- Presentacion Monster para Grupo B

-- Miércoles 5 de junio de 2024
('2024-06-05', '09:00:00', '10:00:00', 3, 1), -- Pasta Monster para Grupo A
('2024-06-05', '10:00:00', '11:00:00', 4, 2), -- Super Slime para Grupo B
('2024-06-05', '11:00:00', '12:00:00', 5, 3), -- Actividad Pasivo Monster para Grupo C
('2024-06-05', '12:00:00', '13:00:00', 6, 4), -- Circuito Activo Monster para Grupo D
('2024-06-05', '13:00:00', '14:00:00', 1, 5), -- Presentacion Monster para Grupo E
('2024-06-05', '14:00:00', '15:00:00', 2, 3), -- Super Burbujas de Colores para Grupo C

-- Jueves 6 de junio de 2024
('2024-06-06', '09:00:00', '10:00:00', 4, 1), -- Super Slime para Grupo A
('2024-06-06', '10:00:00', '11:00:00', 5, 2), -- Actividad Pasivo Monster para Grupo B
('2024-06-06', '11:00:00', '12:00:00', 6, 3), -- Circuito Activo Monster para Grupo C
('2024-06-06', '12:00:00', '13:00:00', 1, 4), -- Presentacion Monster para Grupo D
('2024-06-06', '13:00:00', '14:00:00', 2, 5), -- Super Burbujas de Colores para Grupo E
('2024-06-06', '14:00:00', '15:00:00', 3, 4), -- Pasta Monster para Grupo D

-- Viernes 7 de junio de 2024
('2024-06-07', '09:00:00', '10:00:00', 5, 1), -- Actividad Pasivo Monster para Grupo A
('2024-06-07', '10:00:00', '11:00:00', 6, 2), -- Circuito Activo Monster para Grupo B
('2024-06-07', '11:00:00', '12:00:00', 1, 3), -- Presentacion Monster para Grupo C
('2024-06-07', '12:00:00', '13:00:00', 2, 4), -- Super Burbujas de Colores para Grupo D
('2024-06-07', '13:00:00', '14:00:00', 3, 5), -- Pasta Monster para Grupo E
('2024-06-07', '14:00:00', '15:00:00', 4, 1); -- Super Slime para Grupo A

-- Insertar en la tabla PeriodoNino
INSERT INTO PeriodoNino (fecha_inicio_periodo, fecha_fin_periodo, id_nino) VALUES
('2025-06-02', '2025-06-08', 1),  -- Lucas Gomez
('2025-06-02', '2025-06-29', 2),  -- Mia Gomez
('2025-06-02', '2025-08-31', 3),  -- Juan Chango
('2025-06-02', '2025-06-29', 4),  -- Sofia Chango
('2025-06-02', '2025-06-08', 5),  -- Pedro Huamani
('2025-06-02', '2025-06-29', 6),  -- Valeria Huamani
('2025-06-02', '2025-08-31', 7),  -- Carlos Ruiz
('2025-06-02', '2025-06-29', 8),  -- Ana Fernández
('2025-06-02', '2025-06-08', 9),  -- Juan Santos
('2025-06-02', '2025-06-29', 10), -- Maria Ramírez
('2025-06-02', '2025-08-31', 11), -- Pedro Hernández
('2025-06-02', '2025-06-29', 12), -- Lucia Navarro
('2025-06-02', '2025-06-08', 13), -- Diego Castro
('2025-06-02', '2025-06-29', 14); -- Sofia Mendoza