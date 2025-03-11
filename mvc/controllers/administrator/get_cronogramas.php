<?php

session_start();
header('Content-Type: application/json');

// Verificar si el usuario ha iniciado sesión y si es de tipo 'admin'
if (!isset($_SESSION['id_usuario']) || $_SESSION['tipo_usuario'] !== 'admin') {
    echo json_encode(["status" => "error", "message" => "Acceso denegado", "redirect" => "../../views/log-in.html"]);
    exit;
}

// Incluir el archivo de conexión a la base de datos
require_once(__DIR__ . '/../../../config/conn.php');

// Preparar una consulta SQL para obtener todos los cronogramas
$sql = "SELECT id_cronograma, fecha, hora_inicio, hora_fin, id_actividad, id_grupo FROM Cronograma";

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

$cronogramas = [];
while ($row = $result->fetch_assoc()) {
    $cronogramas[] = $row;
}

echo json_encode(["status" => "success", "cronogramas" => $cronogramas]);

$stmt->close();
$conn->close();
?>