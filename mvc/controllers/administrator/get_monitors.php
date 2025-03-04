<?php
session_start();
header("Content-Type: application/json");

if (!isset($_SESSION['id_usuario']) || $_SESSION['tipo_usuario'] !== 'admin') {
    echo json_encode(["status" => "error", "message" => "Acceso denegado"]);
    exit;
}

include(__DIR__ . '/../../../config/conn.php');

$query = "SELECT m.id_monitor, m.id_usuario, m.nombre, m.apellido, u.nombre_usuario 
          FROM Monitor m 
          JOIN Usuario u ON m.id_usuario = u.id_usuario";
$result = $conn->query($query);

$monitors = [];
while ($row = $result->fetch_assoc()) {
    $monitors[] = $row;
}

echo json_encode(["status" => "success", "monitors" => $monitors]);

$conn->close();
?>