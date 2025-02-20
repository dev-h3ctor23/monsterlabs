<?php
session_start();

// Verificar si el usuario está logueado y si es monitor
if (!isset($_SESSION['id_usuario']) || $_SESSION['tipo_usuario'] !== 'monitor') {
    echo json_encode(["status" => "error", "message" => "Acceso denegado"]);
    exit;
}

// Incluir la conexión a la base de datos
include(__DIR__ . '/../../config/conn.php');

// Obtener el id_usuario de la sesión
$user_id = $_SESSION['id_usuario'];

// Si la solicitud es POST, es para actualizar los datos
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Obtener los datos enviados desde JavaScript
    $data = json_decode(file_get_contents("php://input"), true);

    // Validar si se enviaron datos para cambiar perfil (email, phone)
    if (isset($data['email']) && isset($data['phone'])) {
        $new_email = $data['email'];
        $new_phone = $data['phone'];

        // Actualizar el correo y teléfono en la base de datos
        $stmt1 = $conn->prepare("UPDATE Usuario SET correo = ? WHERE id_usuario = ?");
        $stmt1->bind_param("si", $new_email, $user_id);
        
        $stmt2 = $conn->prepare("UPDATE Monitor SET numero_telefono = ? WHERE id_usuario = ?");
        $stmt2->bind_param("si", $new_phone, $user_id);

        if ($stmt1->execute() && $stmt2->execute()) {
            echo json_encode(["status" => "success", "message" => "Perfil actualizado"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Error al actualizar los datos"]);
        }

        // Cerrar las consultas
        $stmt1->close();
        $stmt2->close();
    }

    // Validar si se enviaron datos para cambiar contraseña
    if (isset($data['currentPassword']) && isset($data['newPassword'])) {
        $currentPassword = $data['currentPassword'];
        $newPassword = $data['newPassword'];

        // Consultar la contraseña actual del usuario
        $stmt = $conn->prepare("SELECT contrasena FROM Usuario WHERE id_usuario = ?");
        $stmt->bind_param("i", $user_id);
        $stmt->execute();
        $stmt->store_result();
        $stmt->bind_result($storedPassword);
        $stmt->fetch();

        // Verificar si la contraseña actual es correcta
        if (!password_verify($currentPassword, $storedPassword)) {
            echo json_encode(["status" => "error", "message" => "Contraseña actual incorrecta"]);
            exit;
        }

        // Hashear la nueva contraseña
        $hashedPassword = password_hash($newPassword, PASSWORD_BCRYPT);

        // Actualizar la contraseña en la base de datos
        $stmt2 = $conn->prepare("UPDATE Usuario SET contrasena = ? WHERE id_usuario = ?");
        $stmt2->bind_param("si", $hashedPassword, $user_id);
        if ($stmt2->execute()) {
            echo json_encode(["status" => "success", "message" => "Contraseña cambiada con éxito"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Hubo un problema al actualizar la contraseña"]);
        }

        $stmt2->close();
    }

    $conn->close();
    exit;
}

// Consultar los datos del usuario en la tabla Usuario
$stmt = $conn->prepare("SELECT nombre_usuario, correo, nombre_tipo FROM Usuario WHERE id_usuario = ?");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$stmt->store_result();
$stmt->bind_result($username, $email, $user_type);

if ($stmt->num_rows > 0) {
    $stmt->fetch();

    // Ahora consultar los datos del monitor en la tabla Monitor
    $stmt2 = $conn->prepare("SELECT dni_monitor, nombre, apellido, numero_telefono FROM Monitor WHERE id_usuario = ?");
    $stmt2->bind_param("i", $user_id);
    $stmt2->execute();
    $stmt2->store_result();
    $stmt2->bind_result($dni, $nombre, $apellido, $telefono);

    if ($stmt2->num_rows > 0) {
        $stmt2->fetch();

        // Devolver los datos en formato JSON
        echo json_encode([
            "status" => "success",
            "usuario" => [
                "username" => $username,
                "email" => $email,
                "user_type" => $user_type
            ],
            "monitor" => [
                "dni" => $dni,
                "nombre" => $nombre,
                "apellido" => $apellido,
                "telefono" => $telefono
            ]
        ]);
    } else {
        echo json_encode(["status" => "error", "message" => "No se encontró información del monitor"]);
    }

    $stmt2->close();
} else {
    echo json_encode(["status" => "error", "message" => "No se encontró información del usuario"]);
}

$stmt->close();
$conn->close();
?>
