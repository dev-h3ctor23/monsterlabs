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

// Preparar una consulta SQL para obtener todas las notificaciones
$sql = "SELECT n.id_notificacion, n.asunto, n.descripcion, n.fecha, u.nombre_usuario AS emisor_nombre, u.nombre_tipo AS emisor_rol
        FROM Notificaciones n
        JOIN Usuario u ON n.id_usuario = u.id_usuario";

$stmt = $conn->prepare($sql);
if (!$stmt) {
    echo json_encode(["status" => "error", "message" => "Error en la preparación de la consulta: " . $conn->error]);
    exit;
}

if (!$stmt->execute()) {
    echo json_encode(["status" => "error", "message" => "Error en la ejecución de la consulta: " . $stmt->error]);
    exit;
}

$result = $stmt->get_result();
if (!$result) {
    echo json_encode(["status" => "error", "message" => "Error al obtener el resultado: " . $stmt->error]);
    exit;
}

$notificaciones = [];
while ($row = $result->fetch_assoc()) {
    $notificaciones[] = $row;
}

echo json_encode(["status" => "success", "notificaciones" => $notificaciones]);

$stmt->close();
$conn->close();
?>

