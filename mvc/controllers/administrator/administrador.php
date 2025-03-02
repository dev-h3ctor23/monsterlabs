<?php
session_start();
header("Content-Type: application/json");

if (!isset($_SESSION['id_usuario']) || $_SESSION['tipo_usuario'] !== 'admin') {
    echo json_encode(["status" => "error", "message" => "Acceso denegado"]);
    exit;
}

include(__DIR__ . '/../../../config/conn.php');

$user_id = $_SESSION['id_usuario'];

$stmt = $conn->prepare("SELECT nombre_usuario, correo FROM Usuario WHERE id_usuario = ?");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$stmt->store_result();
$stmt->bind_result($username, $email);

if ($stmt->num_rows > 0) {
    $stmt->fetch();
    $stmt2 = $conn->prepare("SELECT dni_admin, nombre, apellido, numero_telefono FROM Administrador WHERE id_usuario = ?");
    $stmt2->bind_param("i", $user_id);
    $stmt2->execute();
    $stmt2->store_result();
    $stmt2->bind_result($dni, $nombre, $apellido, $telefono);

    if ($stmt2->num_rows > 0) {
        $stmt2->fetch();
        echo json_encode([
            "status" => "success",
            "usuario" => ["username" => $username, "email" => $email],
            "administrador" => ["dni" => $dni, "nombre" => $nombre, "apellido" => $apellido, "telefono" => $telefono]
        ]);
    } else {
        echo json_encode(["status" => "error", "message" => "No se encontró información del administrador"]);
    }

    $stmt2->close();
} else {
    echo json_encode(["status" => "error", "message" => "No se encontró información del usuario"]);
}

$stmt->close();
$conn->close();
?>