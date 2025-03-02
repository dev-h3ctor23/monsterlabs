<?php
session_start();
header("Content-Type: application/json");

if (!isset($_SESSION['id_usuario']) || $_SESSION['tipo_usuario'] !== 'monitor') {
    echo json_encode(["status" => "error", "message" => "Acceso denegado", "redirect" => "/monsterlabs/mvc/views/log-in.html"]);
    exit;
}

require_once(__DIR__ . '/../../../config/conn.php');

$user_id = $_SESSION['id_usuario'];
$data = json_decode(file_get_contents("php://input"), true);

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    if (isset($data['email']) && isset($data['phone'])) {
        $stmt1 = $conn->prepare("UPDATE Usuario SET correo = ? WHERE id_usuario = ?");
        $stmt1->bind_param("si", $data['email'], $user_id);

        $stmt2 = $conn->prepare("UPDATE Monitor SET numero_telefono = ? WHERE id_usuario = ?");
        $stmt2->bind_param("si", $data['phone'], $user_id);

        if ($stmt1->execute() && $stmt2->execute()) {
            echo json_encode(["status" => "success", "message" => "Perfil actualizado"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Error al actualizar datos"]);
        }

        $stmt1->close();
        $stmt2->close();
    }

    if (isset($data['currentPassword']) && isset($data['newPassword'])) {
        $stmt = $conn->prepare("SELECT contrasena FROM Usuario WHERE id_usuario = ?");
        $stmt->bind_param("i", $user_id);
        $stmt->execute();
        $stmt->store_result();
        $stmt->bind_result($storedPassword);
        $stmt->fetch();

        //verifica si la contraseña actual es correcta
        if (!password_verify($data['currentPassword'], $storedPassword)) {
            echo json_encode(["status" => "error", "message" => "Contraseña actual incorrecta"]);
            exit;
        }

        //verifica si la contraseña es la misma a la anterior
        if (password_verify($data['newPassword'], $storedPassword)) {
            echo json_encode(["status" => "error", "message" => "La nueva contraseña no puede ser igual a la anterior"]);
            exit;
        }

        $hashedPassword = password_hash($data['newPassword'], PASSWORD_BCRYPT);
        $stmt2 = $conn->prepare("UPDATE Usuario SET contrasena = ? WHERE id_usuario = ?");
        $stmt2->bind_param("si", $hashedPassword, $user_id);

        if ($stmt2->execute()) {
            echo json_encode(["status" => "success", "message" => "Contraseña cambiada con éxito"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Error al actualizar contraseña"]);
        }

        $stmt2->close();
    }

    $conn->close();
    exit;
}
?>
