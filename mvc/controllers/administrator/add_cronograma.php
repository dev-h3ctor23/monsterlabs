<?php

session_start();
header('Content-Type: application/json');

// Verificar si el usuario ha iniciado sesión y si es de tipo 'admin'
if (!isset($_SESSION['id_usuario']) || $_SESSION['tipo_usuario'] !== 'admin') {
    echo json_encode(["status" => "error", "message" => "Acceso denegado", "redirect" => "../../views/log-in.html"]);
    exit;
}

// Verificar si se ha proporcionado el ID del cronograma
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["status" => "error", "message" => "Método HTTP no permitido"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);
if (!isset($data['fecha']) || !isset($data['hora_inicio']) || !isset($data['hora_fin']) || !isset($data['id_actividad']) || !isset($data['id_grupo'])) {
    echo json_encode(["status" => "error", "message" => "Datos incompletos"]);
    exit;
}

// Incluir el archivo de conexión a la base de datos
require_once(__DIR__ . '/../../../config/conn.php');

$fecha = $data['fecha'];
$hora_inicio = $data['hora_inicio'];
$hora_fin = $data['hora_fin'];
$id_actividad = $data['id_actividad'];
$id_grupo = $data['id_grupo'];

// Preparar una consulta SQL para insertar el cronograma
$sql = "INSERT INTO Cronograma (fecha, hora_inicio, hora_fin, id_actividad, id_grupo) VALUES (?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
if (!$stmt) {
    echo json_encode(["status" => "error", "message" => "Error en la preparación de la consulta: " . $conn->error]);
    exit;
}

$stmt->bind_param("sssii", $fecha, $hora_inicio, $hora_fin, $id_actividad, $id_grupo);

if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "Cronograma añadido correctamente", "id" => $stmt->insert_id]);
} else {
    echo json_encode(["status" => "error", "message" => "Error al añadir el cronograma: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>