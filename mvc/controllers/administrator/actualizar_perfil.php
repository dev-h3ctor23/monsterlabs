<?php

require_once(__DIR__ . '/../../../config/conn.php');

session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $user_id = $_SESSION['id_usuario'];
    $nombre = $_POST['nombre'];
    $apellido = $_POST['apellido'];
    $dni = $_POST['dni'];
    $telefono = $_POST['telefono'];
    $correo = $_POST['correo'];

    $stmt = $conn->prepare("UPDATE Administrador SET nombre = ?, apellido = ?, dni_admin = ?, numero_telefono = ? WHERE id_usuario = ?");
    $stmt->bind_param("sssii", $nombre, $apellido, $dni, $telefono, $user_id);

    if ($stmt->execute()) {
        $stmt2 = $conn->prepare("UPDATE Usuario SET correo = ? WHERE id_usuario = ?");
        $stmt2->bind_param("si", $correo, $user_id);
        $stmt2->execute();
        $stmt2->close();

        echo json_encode(["status" => "success", "message" => "Perfil actualizado correctamente"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Error al actualizar el perfil"]);
    }

    $stmt->close();
    $conn->close();
} else {
    echo json_encode(["status" => "error", "message" => "Método no permitido"]);
}

?>