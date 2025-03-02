<?php
session_start();
header("Content-Type: application/json");

// Verificar si el usuario está autenticado y es un monitor
if (!isset($_SESSION['id_usuario']) || $_SESSION['tipo_usuario'] !== 'monitor') {
    echo json_encode(["status" => "error", "message" => "Acceso denegado", "redirect" => "/monsterlabs/index.php"]);
    exit;
}

require_once(__DIR__ . '/../../../config/conn.php');

// Leer los datos JSON enviados desde Fetch
$data = json_decode(file_get_contents("php://input"), true);

// Validar que los datos necesarios estén presentes
if (!isset($data['observaciones']) || !isset($data['id_nino'])) {
    echo json_encode(["status" => "error", "message" => "Datos incompletos"]);
    exit;
}

// Procesar los datos recibidos
$observaciones = $data['observaciones'];
$id_nino = $data['id_nino'];

// Verificar si ya existe una observación para el niño
$stmt_check = $conn->prepare("SELECT observacion FROM observaciones WHERE id_nino = ?");
$stmt_check->bind_param("i", $id_nino);
$stmt_check->execute();
$stmt_check->store_result();

if ($stmt_check->num_rows > 0) {
    // Si existe, actualizar las observaciones
    $stmt = $conn->prepare("UPDATE observaciones SET observacion = ? WHERE id_nino = ?");
    $stmt->bind_param("si", $observaciones, $id_nino);
} else {
    // Si no existe, insertar una nueva observación
    $stmt = $conn->prepare("INSERT INTO observaciones (observacion, id_nino) VALUES (?, ?)");
    $stmt->bind_param("si", $observaciones, $id_nino);
}

// Ejecutar la consulta de inserción o actualización
if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "Información guardada correctamente"]);
} else {
    echo json_encode(["status" => "error", "message" => "Error al guardar la información: " . $stmt->error]);
}

// Cerrar las consultas y la conexión
$stmt_check->close();
$stmt->close();
$conn->close();
?>