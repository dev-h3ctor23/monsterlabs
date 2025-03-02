<?php
session_start();
header("Content-Type: application/json");
error_reporting(E_ALL & ~E_NOTICE & ~E_DEPRECATED);

// Verificar que el usuario esté logueado y sea padre
if (!isset($_SESSION['id_usuario']) || $_SESSION['tipo_usuario'] !== 'padre') {
    echo json_encode(["status" => "error", "message" => "Acceso denegado"]);
    exit;
}

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
            $stmt_update = $conn->prepare("UPDATE Padre SET dni_padre = ?, nombre = ?, apellido = ?, numero_telefono = ? WHERE id_usuario = ?");
            $stmt_update->bind_param("ssssi", $data['dni'], $data['nombre'], $data['apellidos'], $data['telefono'], $user_id);
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



    if (isset($data['action']) && $data['action'] === 'updateChild') {
        // Verificar que se envíen los datos necesarios
        if (!isset($data['id_nino'], $data['nombre'], $data['apellido'], $data['fecha_nacimiento'])) {
            echo json_encode(['status' => 'error', 'message' => 'Datos incompletos para actualizar el hijo']);
            $conn->close();
            exit;
        }
        $id_nino = $data['id_nino'];
        $nombre = $data['nombre'];
        $apellido = $data['apellido'];
        $fecha_nacimiento = $data['fecha_nacimiento'];

        // Actualizar los datos del niño (solo se permite si el hijo pertenece al tutor)
        $stmt_update_child = $conn->prepare("UPDATE Nino SET nombre = ?, apellido = ?, fecha_nacimiento = ? WHERE id_nino = ? AND id_padre = ?");
        $stmt_search_padre = $conn->prepare("SELECT id_padre FROM Padre WHERE id_usuario = ?");
        $stmt_search_padre->bind_param("i", $user_id);
        $stmt_search_padre->execute();
        $id_padre = 0;
        $result = $stmt_search_padre->get_result();

        if ($row = $result->fetch_assoc()) {
            $id_padre = $row['id_padre'];
        } else {
            echo json_encode(['status' => 'error', 'message' => 'No se encontró un padre asociado a este usuario']);
            exit;
        }
        $stmt_search_padre->close();
    
        $stmt_update_child->bind_param("sssii", $nombre, $apellido, $fecha_nacimiento, $id_nino, $id_padre);
        if ($stmt_update_child->execute()) {
            echo json_encode(['status' => 'success', 'message' => 'Información del hijo actualizada correctamente']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Error al actualizar la información del hijo']);
        }
        $stmt_update_child->close();
        $conn->close();
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
$stmt = $conn->prepare("SELECT nombre_usuario, correo, nombre_tipo FROM Usuario WHERE id_usuario = ?");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$stmt->store_result();
$stmt->bind_result($username, $email, $user_type);

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
        $stmt3 = $conn->prepare("SELECT id_nino, nombre, apellido, fecha_nacimiento, estado, id_grupo FROM Nino WHERE id_padre = ?");
        $stmt3->bind_param("i", $id_padre);
        $stmt3->execute();
        $result = $stmt3->get_result();
        $ninos = [];
        while ($row = $result->fetch_assoc()) {
            $ninos[] = $row;
        }
        $stmt3->close();


        echo json_encode([
            "status" => "success",
            "usuario" => [
                "username" => $username,
                "email"    => $email,
                "user_type" => $user_type
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


