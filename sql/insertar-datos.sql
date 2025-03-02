

INSERT IGNORE INTO Usuario (nombre_usuario, correo, contrasena, nombre_tipo) VALUES ('juanp', 'juanp@example.com', 'password123', 'padre');
INSERT IGNORE INTO Usuario (nombre_usuario, correo, contrasena, nombre_tipo) VALUES ('maria.m', 'maria.m@example.com', 'password123', 'padre');
INSERT IGNORE INTO Usuario (nombre_usuario, correo, contrasena, nombre_tipo) VALUES ('luism', 'luism@example.com', 'password123', 'monitor');
INSERT IGNORE INTO Usuario (nombre_usuario, correo, contrasena, nombre_tipo) VALUES ('carlosa', 'carlosa@example.com', 'password123', 'monitor');
INSERT IGNORE INTO Usuario (nombre_usuario, correo, contrasena, nombre_tipo) VALUES ('admin1', 'admin1@example.com', 'password123', 'admin');
INSERT IGNORE INTO Usuario (nombre_usuario, correo, contrasena, nombre_tipo) VALUES ('admin2', 'admin2@example.com', 'password123', 'admin');
INSERT IGNORE INTO Usuario (nombre_usuario, correo, contrasena, nombre_tipo) VALUES ('pedro.l', 'pedro.l@example.com', 'password123', 'padre');
INSERT IGNORE INTO Usuario (nombre_usuario, correo, contrasena, nombre_tipo) VALUES ('lucia.g', 'lucia.g@example.com', 'password123', 'monitor');
INSERT IGNORE INTO Usuario (nombre_usuario, correo, contrasena, nombre_tipo) VALUES ('andres.m', 'andres.m@example.com', 'password123', 'monitor');
INSERT IGNORE INTO Usuario (nombre_usuario, correo, contrasena, nombre_tipo) VALUES ('sofia.r', 'sofia.r@example.com', 'password123', 'monitor');
INSERT IGNORE INTO Usuario (nombre_usuario, correo, contrasena, nombre_tipo) VALUES ('andrea.p', 'andrea.p@example.com', 'password123', 'padre');
INSERT IGNORE INTO Usuario (nombre_usuario, correo, contrasena, nombre_tipo) VALUES ('miguel.p', 'miguel.p@example.com', 'password123', 'padre');
INSERT IGNORE INTO Usuario (nombre_usuario, correo, contrasena, nombre_tipo) VALUES ('admin3', 'admin3@example.com', 'password123', 'admin');
INSERT IGNORE INTO Usuario (nombre_usuario, correo, contrasena, nombre_tipo) VALUES ('admin4', 'admin4@example.com', 'password123', 'admin');
INSERT IGNORE INTO Usuario (nombre_usuario, correo, contrasena, nombre_tipo) VALUES ('admin5', 'admin5@example.com', 'password123', 'admin');

INSERT IGNORE INTO Grupo (nombre_grupo) VALUES ('Grupo A');
INSERT IGNORE INTO Grupo (nombre_grupo) VALUES ('Grupo B');
INSERT IGNORE INTO Grupo (nombre_grupo) VALUES ('Grupo C');
INSERT IGNORE INTO Grupo (nombre_grupo) VALUES ('Grupo D');
INSERT IGNORE INTO Grupo (nombre_grupo) VALUES ('Grupo E');

INSERT IGNORE INTO Monitor (dni_monitor, nombre, apellido, numero_telefono, id_usuario, id_grupo) VALUES ('12345678A', 'Luis', 'Martinez', '600123456', 3, 1);
INSERT IGNORE INTO Monitor (dni_mo  nitor, nombre, apellido, numero_telefono, id_usuario, id_grupo) VALUES ('23456789B', 'Carlos', 'Garcia', '600234567', 4, 2);
INSERT IGNORE INTO Monitor (dni_monitor, nombre, apellido, numero_telefono, id_usuario, id_grupo) VALUES ('34567890C', 'Lucia', 'Gomez', '600345678', 8, 3);
INSERT IGNORE INTO Monitor (dni_monitor, nombre, apellido, numero_telefono, id_usuario, id_grupo) VALUES ('45678901D', 'Andres', 'Lopez', '600456789', 9, 4);
INSERT IGNORE INTO Monitor (dni_monitor, nombre, apellido, numero_telefono, id_usuario, id_grupo) VALUES ('56789012E', 'Sofia', 'Rodriguez', '600567890', 10, 5);

INSERT IGNORE INTO Padre (dni_padre, nombre, apellido, numero_telefono, id_usuario) VALUES ('87654321Z', 'Juan', 'Perez', '611111111', 1);
INSERT IGNORE INTO Padre (dni_padre, nombre, apellido, numero_telefono, id_usuario) VALUES ('76543210Y', 'Maria', 'Lopez', '622222222', 2);
INSERT IGNORE INTO Padre (dni_padre, nombre, apellido, numero_telefono, id_usuario) VALUES ('65432109X', 'Pedro', 'Gonzalez', '633333333', 7);
INSERT IGNORE INTO Padre (dni_padre, nombre, apellido, numero_telefono, id_usuario) VALUES ('54321098W', 'Andrea', 'Ramirez', '644444444', 11);
INSERT IGNORE INTO Padre (dni_padre, nombre, apellido, numero_telefono, id_usuario) VALUES ('43210987V', 'Miguel', 'Sanchez', '655555555', 12);

INSERT IGNORE INTO Administrador (dni_admin, nombre, apellido, numero_telefono, id_usuario) VALUES ('11111111A', 'Carlos', 'Martinez', '700111111', 5);
INSERT IGNORE INTO Administrador (dni_admin, nombre, apellido, numero_telefono, id_usuario) VALUES ('22222222B', 'Elena', 'Garcia', '700222222', 6);
INSERT IGNORE INTO Administrador (dni_admin, nombre, apellido, numero_telefono, id_usuario) VALUES ('33333333C', 'Roberto', 'Fernandez', '700333333', 13);
INSERT IGNORE INTO Administrador (dni_admin, nombre, apellido, numero_telefono, id_usuario) VALUES ('44444444D', 'Lucia', 'Torres', '700444444', 14);
INSERT IGNORE INTO Administrador (dni_admin, nombre, apellido, numero_telefono, id_usuario) VALUES ('55555555E', 'Sergio', 'Lopez', '700555555', 15);

INSERT IGNORE INTO Nino (nombre, apellido, fecha_nacimiento, periodo, estado, id_grupo, id_padre) VALUES ('Ana', 'Perez', '2015-03-15', 'mensual', 'activo', 1, 1);
INSERT IGNORE INTO Nino (nombre, apellido, fecha_nacimiento, periodo, estado, id_grupo, id_padre) VALUES ('Luis', 'Sanchez', '2014-07-22', 'semanal', 'activo', 2, 2);
INSERT IGNORE INTO Nino (nombre, apellido, fecha_nacimiento, periodo, estado, id_grupo, id_padre) VALUES ('Marta', 'Lopez', '2016-01-10', 'trimestral', 'activo', 3, 3);
INSERT IGNORE INTO Nino (nombre, apellido, fecha_nacimiento, periodo, estado, id_grupo, id_padre) VALUES ('Diego', 'Garcia', '2015-09-30', 'mensual', 'activo', 4, 4);
INSERT IGNORE INTO Nino (nombre, apellido, fecha_nacimiento, periodo, estado, id_grupo, id_padre) VALUES ('Sofia', 'Martinez', '2014-12-05', 'semanal', 'activo', 5, 5);

INSERT INTO PeriodoNino (fecha_inicio_periodo, fecha_fin_periodo, id_nino) VALUES ('2025-07-01', '2023-07-31', 1);
INSERT INTO PeriodoNino (fecha_inicio_periodo, fecha_fin_periodo, id_nino) VALUES ('2025-06-09', '2023-06-13', 2);
INSERT INTO PeriodoNino (fecha_inicio_periodo, fecha_fin_periodo, id_nino) VALUES ('2025-06-01', '2023-08-31', 3);
INSERT INTO PeriodoNino (fecha_inicio_periodo, fecha_fin_periodo, id_nino) VALUES ('2025-08-01', '2023-08-31', 4);
INSERT INTO PeriodoNino (fecha_inicio_periodo, fecha_fin_periodo, id_nino) VALUES ('2025-08-04', '2023-08-08', 5);

INSERT IGNORE INTO Asistencia (fecha, id_nino, estado) VALUES ('2023-06-10', 1, 'asistio');
INSERT IGNORE INTO Asistencia (fecha, id_nino, estado) VALUES ('2023-06-10', 2, 'ausente');
INSERT IGNORE INTO Asistencia (fecha, id_nino, estado) VALUES ('2023-06-10', 3, 'asistio');
INSERT IGNORE INTO Asistencia (fecha, id_nino, estado) VALUES ('2023-06-10', 4, 'asistio');
INSERT IGNORE INTO Asistencia (fecha, id_nino, estado) VALUES ('2023-06-10', 5, 'ausente');

INSERT IGNORE INTO Pago (nombre_tipo, id_padre) VALUES ('transferencia', 1);
INSERT IGNORE INTO Pago (nombre_tipo, id_padre) VALUES ('bizum', 2);
INSERT IGNORE INTO Pago (nombre_tipo, id_padre) VALUES ('pagoCentro', 3);
INSERT IGNORE INTO Pago (nombre_tipo, id_padre) VALUES ('transferencia', 4);
INSERT IGNORE INTO Pago (nombre_tipo, id_padre) VALUES ('bizum', 5);

INSERT IGNORE INTO Guardian (dni_guardian, nombre, apellido, telefono) VALUES ('98765432K', 'Rosa', 'Vega', '600111222');
INSERT IGNORE INTO Guardian (dni_guardian, nombre, apellido, telefono) VALUES ('87654321L', 'Jorge', 'Marin', '600222333');
INSERT IGNORE INTO Guardian (dni_guardian, nombre, apellido, telefono) VALUES ('76543210M', 'Laura', 'Ortega', '600333444');
INSERT IGNORE INTO Guardian (dni_guardian, nombre, apellido, telefono) VALUES ('65432109N', 'Fernando', 'Diaz', '600444555');
INSERT IGNORE INTO Guardian (dni_guardian, nombre, apellido, telefono) VALUES ('54321098O', 'Carmen', 'Soto', '600555666');

INSERT IGNORE INTO GuardianNino (relacion, id_nino, id_guardian) VALUES ('tio', 1, 1);
INSERT IGNORE INTO GuardianNino (relacion, id_nino, id_guardian) VALUES ('abuelo', 2, 2);
INSERT IGNORE INTO GuardianNino (relacion, id_nino, id_guardian) VALUES ('amigo', 3, 3);
INSERT IGNORE INTO GuardianNino (relacion, id_nino, id_guardian) VALUES ('primo', 4, 4);
INSERT IGNORE INTO GuardianNino (relacion, id_nino, id_guardian) VALUES ('vecino', 5, 5);

INSERT IGNORE INTO Actividad (nombre_actividad, descripcion) VALUES ('Presentacion Monster', 'Introducción a la temática Monster con dinámicas grupales.');
INSERT IGNORE INTO Actividad (nombre_actividad, descripcion) VALUES ('Super Burbujas de Colores', 'Actividad creativa con burbujas y colorantes para experimentos visuales.');
INSERT IGNORE INTO Actividad (nombre_actividad, descripcion) VALUES ('Pasta Monster', 'Elaboración de pasta comestible con formas monstruosas.');
INSERT IGNORE INTO Actividad (nombre_actividad, descripcion) VALUES ('Super Slime', 'La actividad se llevará a cabo en el patio central, brindando a los niños y niñas un espacio amplio y cómodo para expresarse libremente. Antes de comenzar, se presentarán los materiales y se formularán preguntas para activar sus conocimientos previos. Luego, se les animará a crear un slime gigante de manera colaborativa, asegurando que todos participen. Al finalizar, se pondrá música para enriquecer la experiencia, permitiendo que los niños y niñas manipulen el slime mientras realizan movimientos con sus extremidades.');
INSERT IGNORE INTO Actividad (nombre_actividad, descripcion) VALUES ('Actividad Pasivo Monter', 'Actividad de relajación y creatividad en silencio con temática Monster.');


INSERT IGNORE INTO Cronograma (id_cronograma, fecha, hora_inicio, hora_fin, id_actividad, id_grupo) VALUES (1,'2025-03-01', '10:00:00', '11:30:00', 1, 1);
INSERT IGNORE INTO Cronograma (id_cronograma, fecha, hora_inicio, hora_fin, id_actividad, id_grupo)  VALUES (2,'2025-03-02', '14:00:00', '15:30:00', 2, 2);
INSERT IGNORE INTO Cronograma (id_cronograma, fecha, hora_inicio, hora_fin, id_actividad, id_grupo)  VALUES (3,'2025-03-03', '09:30:00', '11:00:00', 3, 3);
INSERT IGNORE INTO Cronograma (id_cronograma, fecha, hora_inicio, hora_fin, id_actividad, id_grupo)  VALUES (4,'2025-03-04', '13:00:00', '14:30:00', 4, 4);
INSERT IGNORE INTO Cronograma (id_cronograma, fecha, hora_inicio, hora_fin, id_actividad, id_grupo)  VALUES (5,'2025-03-05', '16:00:00', '17:30:00', 5, 5);
