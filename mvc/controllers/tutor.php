<?php

header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");
session_start();
header("Content-Type: application/json");
error_reporting(E_ALL & ~E_NOTICE & ~E_DEPRECATED);

// Verificar que el usuario esté logueado y sea padre
if (!isset($_SESSION['id_usuario']) || $_SESSION['tipo_usuario'] !== 'padre') {
    echo json_encode(["status" => "error", "message" => "Acceso denegado"]);
    exit;
}
/*
session_start();
if (!isset($_SESSION['id_usuario']) || $_SESSION['tipo_usuario'] !== 'padre') {
    header("Location: /monsterlabs/mvc/views/login.html");
    exit();
}*/


// Incluir la conexión a la base de datos
include(__DIR__ . '/../../config/conn.php');
$user_id = $_SESSION['id_usuario'];

// Decodificar los datos recibidos (si los hay)
$input = file_get_contents("php://input");
if (empty(trim($input))) {
    $data = [];
} else {
    $data = json_decode($input, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        echo json_encode(["status" => "error", "message" => "Error en el formato JSON recibido!!"]);
        exit;
    }
}


if ($_SERVER["REQUEST_METHOD"] === "POST") {
    if (!$data) {
        echo json_encode(["status" => "error", "message" => "No se recibieron datos"]);
        exit;
    }
    error_log(json_encode($data['action']));
    error_log(json_encode($data));
    error_log("linea 35");
    // 1. Registro del campamento (inscripción del niño)
    if (isset($data['fechaNacimiento'], $data['formaPago'])) {
        $nombre = $data['nombre'];
        $apellidos = $data['apellidos'];
        $fechaNacimiento = $data['fechaNacimiento'];
        $periodo = $data['periodo'];
        $stmt = $conn->prepare("SELECT id_padre FROM Padre WHERE id_usuario = ?");
        $stmt->bind_param("i", $user_id);
        $stmt->execute();
        $id_padre = 0;
        $result = $stmt->get_result();

        if ($row = $result->fetch_assoc()) {
            $id_padre = $row['id_padre'];
        } else {
            echo json_encode(['status' => 'error', 'message' => 'No se encontró un padre asociado a este usuario']);
            exit;
        }
        $stmt->close();
    

        $formaPago = $data['formaPago'];
        $nombre_tipo = ($formaPago === 'pago-centro') ? 'pagoCentro' : $formaPago;

        $alergiaAlimentos = $data['alergiaAlimentos'] ?? 'Ninguno';
        $alergiaMedicamentos = $data['alergiaMedicamentos'] ?? 'Ninguno';
        $medicamentoActual = $data['medicamentoActual'] ?? 'Ninguno';

        $responsableAdicional = $data['responsableAdicional'] ?? 'no';


        $conn->autocommit(false);

        // a) Insertar en Nino
        $stmt = $conn->prepare("INSERT INTO Nino (nombre, apellido, fecha_nacimiento, periodo, estado, id_padre) VALUES (?, ?, ?, ?,'inactivo', ?)");
        $stmt->bind_param("ssssi", $nombre, $apellidos, $fechaNacimiento, $periodo, $id_padre);
        if (!$stmt->execute()) {
            $conn->rollback();
            echo json_encode(['status' => 'error', 'message' => 'Error al insertar datos del niño']);
            exit;
        }
        $id_nino = $stmt->insert_id;
        $stmt->close();

        if (isset($data['periodos']) && is_array($data['periodos'])) {
            foreach ($data['periodos'] as $periodoItem) {
                $fechaInicioPeriodo = $periodoItem['fechaInicio'];
                $fechaFinPeriodo = $periodoItem['fechaFin'];
                $stmt = $conn->prepare("INSERT INTO PeriodoNino (fecha_inicio_periodo, fecha_fin_periodo, id_nino) VALUES (?, ?, ?)");
                $stmt->bind_param("ssi", $fechaInicioPeriodo, $fechaFinPeriodo, $id_nino);
                if (!$stmt->execute()) {
                    $conn->rollback();
                    echo json_encode(['status' => 'error', 'message' => 'Error al insertar período asociado']);
                    exit;
                }
                $stmt->close();
            }
        }
        // b) Insertar en Pago
        $stmt = $conn->prepare("INSERT INTO Pago (nombre_tipo, id_padre) VALUES (?, ?)");
        $stmt->bind_param("si", $nombre_tipo, $id_padre);
        if (!$stmt->execute()) {
            $conn->rollback();
            echo json_encode(['status' => 'error', 'message' => 'Error al insertar datos de pago']);
            exit;
        }
        $stmt->close();

        // c) Insertar en FichaMedica
        $stmt = $conn->prepare("INSERT INTO FichaMedica (alimentos_alergico, medicamentos_alergico, medicamentos_actuales, id_nino) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("sssi", $alergiaAlimentos, $alergiaMedicamentos, $medicamentoActual, $id_nino);
        if (!$stmt->execute()) {
            $conn->rollback();
            echo json_encode(['status' => 'error', 'message' => 'Error al insertar ficha médica']);
            exit;
        }
        $stmt->close();

        // d) Insertar responsable adicional si es requerido
        if ($responsableAdicional === 'si') {
            if (!isset(
                $data['nombreResponsable'],
                $data['apellidosResponsable'],
                $data['dniResponsable'],
                $data['telefonoResponsable'],
                $data['relacionResponsable']
            )) {
                $conn->rollback();
                echo json_encode([
                    'status'  => 'error',
                    'message' => 'Faltan campos del responsable adicional'
                ]);
                exit;
            }

            $nombreResponsable    = $data['nombreResponsable'];
            $apellidosResponsable = $data['apellidosResponsable'];
            $dniResponsable       = $data['dniResponsable'];
            $telefonoResponsable  = $data['telefonoResponsable'];
            $relacionResponsable  = $data['relacionResponsable'];

            $stmt = $conn->prepare(
                "INSERT INTO Guardian (dni_guardian, nombre, apellido, telefono) 
                 VALUES (?, ?, ?, ?)"
            );
            $stmt->bind_param("ssss", $dniResponsable, $nombreResponsable, $apellidosResponsable, $telefonoResponsable);
            if (!$stmt->execute()) {
                $conn->rollback();
                echo json_encode([
                    'status'  => 'error',
                    'message' => 'Error al insertar datos del responsable adicional'
                ]);
                exit;
            }
            $id_guardian = $stmt->insert_id;
            $stmt->close();

            $stmt = $conn->prepare(
                "INSERT INTO GuardianNino (relacion, id_nino, id_guardian) VALUES (?, ?, ?)"
            );
            $stmt->bind_param("sii", $relacionResponsable, $id_nino, $id_guardian);
            if (!$stmt->execute()) {
                $conn->rollback();
                echo json_encode([
                    'status'  => 'error',
                    'message' => 'Error al relacionar el responsable con el niño'
                ]);
                exit;
            }
            $stmt->close();
        }

        $conn->commit();
        $conn->autocommit(true);

        echo json_encode(['status' => 'success', 'message' => 'Registro completado correctamente']);
        $conn->close();
        exit;
    }

    // 2. Cambio de contraseña
    if (isset($data['currentPassword'], $data['newPassword'])) {
        $currentPassword = $data['currentPassword'];
        $newPassword = $data['newPassword'];

        $stmt = $conn->prepare("SELECT contrasena FROM Usuario WHERE id_usuario = ?");
        $stmt->bind_param("i", $user_id);
        $stmt->execute();
        $stmt->store_result();
        $stmt->bind_result($storedPassword);
        $stmt->fetch();
        $stmt->close();

        if (!password_verify($currentPassword, $storedPassword)) {
            echo json_encode(["status" => "error", "message" => "Contraseña actual incorrecta"]);
            $conn->close();
            exit;
        }

        $hashedPassword = password_hash($newPassword, PASSWORD_BCRYPT);
        $stmt2 = $conn->prepare("UPDATE Usuario SET contrasena = ? WHERE id_usuario = ?");
        $stmt2->bind_param("si", $hashedPassword, $user_id);
        if ($stmt2->execute()) {
            echo json_encode(["status" => "success", "message" => "Contraseña cambiada con éxito"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Hubo un problema al actualizar la contraseña"]);
        }
        $stmt2->close();
        $conn->close();
        exit;
    }

    // 3. Actualización del perfil del tutor (registro de padre)
    if (isset($data['nombre'], $data['apellidos'], $data['dni'], $data['telefono']) && $data['action'] != 'updateProfile') {
        // Verificar si el usuario ya está registrado como padre
        $stmt_check = $conn->prepare("SELECT id_padre FROM Padre WHERE id_usuario = ?");
        $stmt_check->bind_param("i", $user_id);
        $stmt_check->execute();
        $stmt_check->store_result();
        if ($stmt_check->num_rows > 0) {
            echo json_encode(["status" => "success", "message" => "El usuario ya está registrado como padre"]);
            $stmt_check->close();
            $conn->close();
            exit;
        }
        $stmt_check->close();

        $nombre = $data['nombre'];
        $apellidos = $data['apellidos'];
        $dni = $data['dni'];
        $telefono = $data['telefono'];

        $stmt1 = $conn->prepare("INSERT INTO Padre (dni_padre, nombre, apellido, numero_telefono, id_usuario) VALUES (?, ?, ?, ?, ?)");
        $stmt1->bind_param("ssssi", $dni, $nombre, $apellidos, $telefono, $user_id);
        if ($stmt1->execute()) {
            echo json_encode(["status" => "success", "message" => "Perfil actualizado"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Error al actualizar los datos"]);
        }
        $stmt1->close();
        $conn->close();
        exit;
    }


    if (isset($data['action']) && $data['action'] === 'updateProfile') {
        // Verificar si el usuario ya tiene registro en Padre
        error_log(json_encode($data['action']));
        error_log("lINEA 245");
        $stmt_check = $conn->prepare("SELECT id_padre FROM Padre WHERE id_usuario = ?");
        $stmt_check->bind_param("i", $user_id);
        $stmt_check->execute();
        $stmt_check->store_result();

        if ($stmt_check->num_rows > 0) {
            // Si ya existe, actualizamos la información
            $stmt_check->close();
            $telefono = isset($data['telefono']) ? $data['telefono'] : '';
            $stmt_update = $conn->prepare("UPDATE Padre SET dni_padre = ?, nombre = ?, apellido = ?, numero_telefono = ? WHERE id_usuario = ?");
            $stmt_update->bind_param("ssssi", $data['dni'], $data['nombre'], $data['apellidos'], $telefono, $user_id);
            if ($stmt_update->execute()) {
                echo json_encode(["status" => "success", "message" => "Perfil actualizadoOO correctamente"]);
            } else {
                echo json_encode(["status" => "error", "message" => "Error al actualizar los datos"]);
            }
            $stmt_update->close();
            $conn->close();
            exit;
        } else {
            // Si no existe, se inserta un nuevo registro (opcional)
            $stmt_check->close();
            $stmt_insert = $conn->prepare("INSERT INTO Padre (dni_padre, nombre, apellido, numero_telefono, id_usuario) VALUES (?, ?, ?, ?, ?)");
            $stmt_insert->bind_param("ssssi", $data['dni'], $data['nombre'], $data['apellidos'], $data['telefono'], $user_id);
            if ($stmt_insert->execute()) {
                echo json_encode(["status" => "success", "message" => "Perfil creado correctamente"]);
            } else {
                echo json_encode(["status" => "error", "message" => "Error al crear el perfil"]);
            }
            $stmt_insert->close();
            $conn->close();
            exit;
        }
    }




    if (isset($data['action']) && $data['action'] === 'updateChildFull') {
        // Determinar si se requiere guardian según el campo enviado
        $guardian_required = (isset($data['responsableAdicional']) && $data['responsableAdicional'] === 'si');
    
        // Validar campos obligatorios del niño
        $requiredFields = ['id_nino', 'nombre', 'apellido', 'fecha_nacimiento'];
        foreach ($requiredFields as $field) {
            if (!isset($data[$field]) || trim($data[$field]) === "") {
                echo json_encode(['status' => 'error', 'message' => 'Datos incompletos del niño']);
                exit;
            }
        }
    
        // Si se requiere guardian, validar sus campos obligatorios
        if ($guardian_required) {
            $guardianRequiredFields = ['dni_guardian', 'guardian_nombre', 'guardian_apellido'];
            foreach ($guardianRequiredFields as $field) {
                if (!isset($data[$field]) || trim($data[$field]) === "") {
                    echo json_encode(['status' => 'error', 'message' => 'Datos incompletos del guardian']);
                    exit;
                }
            }
        }
    
        // Recoger los datos del niño
        $id_nino              = $data['id_nino'];
        $nombre               = $data['nombre'];
        $apellido             = $data['apellido'];
        $fecha_nacimiento     = $data['fecha_nacimiento'];
        $alimentos_alergico   = $data['alimentos_alergico'];
        $medicamentos_alergico= $data['medicamentos_alergico'];
        $medicamentos_actuales= $data['medicamentos_actuales'];
    
        $conn->begin_transaction();
    
        // Obtener id_padre a partir de la sesión
        $stmt = $conn->prepare("SELECT id_padre FROM Padre WHERE id_usuario = ?");
        $stmt->bind_param("i", $user_id);
        $stmt->execute();
        $stmt->bind_result($id_padre);
        if (!$stmt->fetch()) {
           echo json_encode(['status' => 'error', 'message' => 'Padre no encontrado']);
           $stmt->close();
           $conn->rollback();
           exit;
        }
        $stmt->close();
    
        // Actualizar datos del niño
        $stmt_update = $conn->prepare("UPDATE Nino SET nombre = ?, apellido = ?, fecha_nacimiento = ? WHERE id_nino = ? AND id_padre = ?");
        $stmt_update->bind_param("sssii", $nombre, $apellido, $fecha_nacimiento, $id_nino, $id_padre);
        if (!$stmt_update->execute()) {
            echo json_encode(['status' => 'error', 'message' => 'Error al actualizar datos del niño']);
            $stmt_update->close();
            $conn->rollback();
            exit;
        }
        $stmt_update->close();
    
        // Actualizar o insertar la ficha médica
        $stmt_check = $conn->prepare("SELECT id_ficha FROM FichaMedica WHERE id_nino = ?");
        $stmt_check->bind_param("i", $id_nino);
        $stmt_check->execute();
        $stmt_check->store_result();
        if ($stmt_check->num_rows > 0) {
            $stmt_check->bind_result($id_ficha);
            $stmt_check->fetch();
            $stmt_check->close();
            $stmt_update_ficha = $conn->prepare("UPDATE FichaMedica SET alimentos_alergico = ?, medicamentos_alergico = ?, medicamentos_actuales = ? WHERE id_ficha = ?");
            $stmt_update_ficha->bind_param("sssi", $alimentos_alergico, $medicamentos_alergico, $medicamentos_actuales, $id_ficha);
            if (!$stmt_update_ficha->execute()) {
                echo json_encode(['status' => 'error', 'message' => 'Error al actualizar ficha médica']);
                $stmt_update_ficha->close();
                $conn->rollback();
                exit;
            }
            $stmt_update_ficha->close();
        } else {
            $stmt_check->close();
            $stmt_insert_ficha = $conn->prepare("INSERT INTO FichaMedica (alimentos_alergico, medicamentos_alergico, medicamentos_actuales, id_nino) VALUES (?, ?, ?, ?)");
            $stmt_insert_ficha->bind_param("sssi", $alimentos_alergico, $medicamentos_alergico, $medicamentos_actuales, $id_nino);
            if (!$stmt_insert_ficha->execute()) {
                echo json_encode(['status' => 'error', 'message' => 'Error al insertar ficha médica']);
                $stmt_insert_ficha->close();
                $conn->rollback();
                exit;
            }
            $stmt_insert_ficha->close();
        }
    
        if ($guardian_required) {
            // Se requiere guardian: recoger datos del guardian
            $dni_guardian       = $data['dni_guardian'];
            $guardian_nombre    = $data['guardian_nombre'];
            $guardian_apellido  = $data['guardian_apellido'];
            $telefono_guardian  = isset($data['telefono_guardian']) ? $data['telefono_guardian'] : '';
            $guardian_relacion  = isset($data['relacion_guardian']) ? $data['relacion_guardian'] : '';
    
            // Verificar si ya existe un guardian asociado para este niño
            $stmt_guardian = $conn->prepare("
                SELECT g.id_guardian, gn.relacion 
                FROM Guardian g
                JOIN GuardianNino gn ON g.id_guardian = gn.id_guardian
                WHERE gn.id_nino = ?
            ");
            $stmt_guardian->bind_param("i", $id_nino);
            $stmt_guardian->execute();
            $stmt_guardian->store_result();
    
            if ($stmt_guardian->num_rows > 0) {
                $stmt_guardian->bind_result($id_guardian, $relacion_actual);
                $stmt_guardian->fetch();
                $stmt_guardian->close();
    
                // Actualizar datos del guardian
                $stmt_update_guardian = $conn->prepare("UPDATE Guardian SET dni_guardian = ?, nombre = ?, apellido = ?, telefono = ? WHERE id_guardian = ?");
                $stmt_update_guardian->bind_param("ssssi", $dni_guardian, $guardian_nombre, $guardian_apellido, $telefono_guardian, $id_guardian);
                if (!$stmt_update_guardian->execute()) {
                    echo json_encode(['status' => 'error', 'message' => 'Error al actualizar datos del guardian']);
                    $stmt_update_guardian->close();
                    $conn->rollback();
                    exit;
                }
                $stmt_update_guardian->close();
    
                // Actualizar la relación si ha cambiado
                if ($relacion_actual !== $guardian_relacion) {
                    $stmt_update_gn = $conn->prepare("UPDATE GuardianNino SET relacion = ? WHERE id_nino = ? AND id_guardian = ?");
                    $stmt_update_gn->bind_param("sii", $guardian_relacion, $id_nino, $id_guardian);
                    if (!$stmt_update_gn->execute()) {
                        echo json_encode(['status' => 'error', 'message' => 'Error al actualizar la relación en GuardianNino']);
                        $stmt_update_gn->close();
                        $conn->rollback();
                        exit;
                    }
                    $stmt_update_gn->close();
                }
            } else {
                $stmt_guardian->close();
                // Insertar nuevo guardian y la relación
                $stmt_insert_guardian = $conn->prepare("INSERT INTO Guardian (dni_guardian, nombre, apellido, telefono) VALUES (?, ?, ?, ?)");
                $stmt_insert_guardian->bind_param("ssss", $dni_guardian, $guardian_nombre, $guardian_apellido, $telefono_guardian);
                if (!$stmt_insert_guardian->execute()) {
                    echo json_encode(['status' => 'error', 'message' => 'Error al insertar datos del guardian']);
                    $stmt_insert_guardian->close();
                    $conn->rollback();
                    exit;
                }
                $id_guardian = $stmt_insert_guardian->insert_id;
                $stmt_insert_guardian->close();
    
                $stmt_insert_gn = $conn->prepare("INSERT INTO GuardianNino (relacion, id_nino, id_guardian) VALUES (?, ?, ?)");
                $stmt_insert_gn->bind_param("sii", $guardian_relacion, $id_nino, $id_guardian);
                if (!$stmt_insert_gn->execute()) {
                    echo json_encode(['status' => 'error', 'message' => 'Error al relacionar guardian con el niño']);
                    $stmt_insert_gn->close();
                    $conn->rollback();
                    exit;
                }
                $stmt_insert_gn->close();
            }
        } else {
            // No se requiere guardian: eliminar cualquier asociación previa existente
            $stmt_guardian = $conn->prepare("SELECT g.id_guardian FROM Guardian g JOIN GuardianNino gn ON g.id_guardian = gn.id_guardian WHERE gn.id_nino = ?");
            $stmt_guardian->bind_param("i", $id_nino);
            $stmt_guardian->execute();
            $stmt_guardian->store_result();
            if ($stmt_guardian->num_rows > 0) {
                $stmt_guardian->bind_result($id_guardian);
                $stmt_guardian->fetch();
                $stmt_guardian->close();
    
                // Eliminar la relación en GuardianNino
                $stmt_delete_gn = $conn->prepare("DELETE FROM GuardianNino WHERE id_nino = ? AND id_guardian = ?");
                $stmt_delete_gn->bind_param("ii", $id_nino, $id_guardian);
                if (!$stmt_delete_gn->execute()) {
                    echo json_encode(['status' => 'error', 'message' => 'Error al eliminar la relación del guardian']);
                    $stmt_delete_gn->close();
                    $conn->rollback();
                    exit;
                }
                $stmt_delete_gn->close();
    
                // Eliminar el registro del guardian (si no es compartido con otros registros)
                $stmt_delete_guardian = $conn->prepare("DELETE FROM Guardian WHERE id_guardian = ?");
                $stmt_delete_guardian->bind_param("i", $id_guardian);
                if (!$stmt_delete_guardian->execute()) {
                    echo json_encode(['status' => 'error', 'message' => 'Error al eliminar el guardian']);
                    $stmt_delete_guardian->close();
                    $conn->rollback();
                    exit;
                }
                $stmt_delete_guardian->close();
            } else {
                $stmt_guardian->close();
            }
        }
    
        $conn->commit();
        echo json_encode(['status' => 'success', 'message' => 'Información actualizada correctamente']);
        exit;
    }
    

    if (isset($data['action']) && $data['action'] === 'deleteChild') {
        if (!isset($data['id_nino'])) {
            echo json_encode(['status' => 'error', 'message' => 'ID de hijo no proporcionado']);
            exit;
        }
        $id_nino = $data['id_nino'];

        // Obtener el id_padre del usuario logueado
        $stmt_padre = $conn->prepare("SELECT id_padre FROM Padre WHERE id_usuario = ?");
        $stmt_padre->bind_param("i", $user_id);
        $stmt_padre->execute();
        $stmt_padre->store_result();
        if ($stmt_padre->num_rows == 0) {
            echo json_encode(['status' => 'error', 'message' => 'No se encontró el padre asociado al usuario']);
            exit;
        }
        $stmt_padre->bind_result($id_padre);
        $stmt_padre->fetch();
        $stmt_padre->close();

        // Eliminar el registro del niño, solo si pertenece al padre
        $stmt_delete = $conn->prepare("DELETE FROM Nino WHERE id_nino = ? AND id_padre=?");
        $stmt_delete->bind_param("ii", $id_nino, $id_padre);
        if ($stmt_delete->execute()) {
            if ($stmt_delete->affected_rows > 0) {
                echo json_encode(['status' => 'success', 'message' => 'Hijo eliminado correctamente']);
            } else {
                echo json_encode(['status' => 'error', 'message' => 'No se encontró el hijo o no pertenece al tutor']);
            }
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Error al eliminar el hijo']);
        }
        $stmt_delete->close();
        $conn->close();
        exit;
    }


    // Verificar si se enviaron datos para la notificación
if (isset($data['asunto']) && isset($data['descripcion'])) {
    $asunto = $data['asunto'];
    $descripcion = $data['descripcion'];
    // Usamos la fecha actual (puedes cambiarla si lo requieres)
    $fecha = date('Y-m-d');
    // $user_id se obtiene de la sesión, ya que el usuario debe estar logueado
    $stmt = $conn->prepare("INSERT INTO Notificaciones (asunto, descripcion, fecha, id_usuario) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("sssi", $asunto, $descripcion, $fecha, $user_id);
    if ($stmt->execute()) {
        echo json_encode(['status' => 'success', 'message' => 'Notificación guardada correctamente']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Error al guardar la notificación']);
    }
    $stmt->close();
    exit;
}


    echo json_encode(["status" => "error", "message" => "Acción no reconocida"]);
    $conn->close();
    exit;
}
//-------------------------------------------------------------------//
//                              QUERY'S 
//-------------------------------------------------------------------//



// Si se realiza una solicitud GET, se devuelven los datos del tutor
$stmt = $conn->prepare("SELECT nombre_usuario, correo, nombre_tipo, foto FROM Usuario WHERE id_usuario = ?");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$stmt->store_result();
$stmt->bind_result($username, $email, $user_type, $foto);

if ($stmt->num_rows > 0) {
    $stmt->fetch();

    // Seleccionar datos del padre incluyendo el id_padre
    $stmt2 = $conn->prepare("SELECT id_padre, dni_padre, nombre, apellido, numero_telefono FROM Padre WHERE id_usuario = ?");
    $stmt2->bind_param("i", $user_id);
    $stmt2->execute();
    $stmt2->store_result();
    $stmt2->bind_result($id_padre, $dni, $nombre, $apellido, $telefono);

    if ($stmt2->num_rows > 0) {
        $stmt2->fetch();

        // Obtener la información de los hijos
        $stmt3 = $conn->prepare("
        SELECT n.id_nino, n.nombre, n.apellido, n.fecha_nacimiento, n.estado, n.id_grupo,
                fm.alimentos_alergico, fm.medicamentos_alergico, fm.medicamentos_actuales,
                g.id_guardian, g.dni_guardian, g.nombre AS guardian_nombre, g.apellido AS guardian_apellido, g.telefono AS guardian_telefono, gn.relacion AS relacion_guardian
        FROM Nino n
        LEFT JOIN FichaMedica fm ON n.id_nino = fm.id_nino
    LEFT JOIN GuardianNino gn ON n.id_nino = gn.id_nino
        LEFT JOIN Guardian g ON gn.id_guardian = g.id_guardian
        WHERE n.id_padre = ?
        ");
        $stmt3->bind_param("i", $id_padre);
        $stmt3->execute();
        $result = $stmt3->get_result();
        $ninos = [];
        while ($row = $result->fetch_assoc()) {
            // Procesar ficha médica (si existe)
    $ficha_medica = null;
    if (!is_null($row['alimentos_alergico']) || !is_null($row['medicamentos_alergico']) || !is_null($row['medicamentos_actuales'])) {
         $ficha_medica = [
             'alimentos_alergico'    => $row['alimentos_alergico'],
             'medicamentos_alergico'  => $row['medicamentos_alergico'],
             'medicamentos_actuales'  => $row['medicamentos_actuales']
         ];
    }
    
    // Procesar guardian (si existe)
    $guardian = null;
    if (!is_null($row['id_guardian'])) {
         $guardian = [
             'id_guardian'   => $row['id_guardian'],
             'dni_guardian'  => $row['dni_guardian'],
             'nombre'        => $row['guardian_nombre'],
             'apellido'      => $row['guardian_apellido'],
             'telefono'      => $row['guardian_telefono'],
             'relacion'      => $row['relacion_guardian']
         ];
    }
    
    $ninos[] = [
         'id_nino'         => $row['id_nino'],
         'nombre'          => $row['nombre'],
         'apellido'        => $row['apellido'],
         'fecha_nacimiento'=> $row['fecha_nacimiento'],
         'estado'          => $row['estado'],
         'id_grupo'        => $row['id_grupo'],
         'ficha_medica'    => $ficha_medica,
         'guardian'        => $guardian
    ];
        }
        $stmt3->close();


        echo json_encode([
            "status" => "success",
            "usuario" => [
                "username" => $username,
                "email"    => $email,
                "user_type" => $user_type,
                "foto" => $foto
            ],
            "padre" => [
                "dni"      => $dni,
                "nombre"   => $nombre,
                "apellido" => $apellido,
                "telefono" => $telefono
            ],
            "ninos" => $ninos
        ]);
    } else {
        // No existe registro de padre, se retorna de forma explícita
        echo json_encode(["status" => "success", "padre" => false]);
    }

    $stmt2->close();
} else {
    echo json_encode(["status" => "error", "message" => "No se encontró información del usuario"]);
}

$stmt->close();
$conn->close();




