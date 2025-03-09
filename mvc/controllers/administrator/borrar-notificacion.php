<?php

session_start();
header("Content-Type: application/json");

// Verificar si el usuario ha iniciado sesión y si es de tipo 'admin'
if (!isset($_SESSION['id_usuario']) || $_SESSION['tipo_usuario'] !== 'admin') {
    echo json_encode(["status" => "error", "message" => "Acceso denegado", "redirect" => "../../views/log-in.html"]);
    exit;
}

// Incluir el archivo de conexión a la base de datos
require_once(__DIR__ . '/../../../config/conn.php');

$id_notificacion = $_GET['id'];

// Preparar una consulta SQL para borrar la notificación
$stmt = $conn->prepare("DELETE FROM Notificaciones WHERE id_notificacion = ?");
$stmt->bind_param("i", $id_notificacion);
$stmt->execute();

if ($stmt->affected_rows > 0) {
    echo json_encode(["status" => "success", "message" => "Notificación borrada"]);
} else {
    echo json_encode(["status" => "error", "message" => "Error al borrar la notificación"]);
}

$stmt->close();
$conn->close();
?>