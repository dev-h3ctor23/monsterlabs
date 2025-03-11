<?php

session_start();
header('Content-Type: application/json');

// Verificar si el usuario ha iniciado sesión y si es de tipo 'admin'
if (!isset($_SESSION['id_usuario']) || $_SESSION['tipo_usuario'] !== 'admin') {
    echo json_encode(["status" => "error", "message" => "Acceso denegado", "redirect" => "../../views/log-in.html"]);
    exit;
}

// Verificar si se ha proporcionado el ID del cronograma
if ($_SERVER['REQUEST_METHOD'] !== 'POST' || $_SERVER['HTTP_X_HTTP_METHOD_OVERRIDE'] !== 'DELETE') {
    echo json_encode(["status" => "error", "message" => "Método HTTP no permitido"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);
if (!isset($data['id'])) {
    echo json_encode(["status" => "error", "message" => "ID de cronograma no proporcionado"]);
    exit;
}

// Incluir el archivo de conexión a la base de datos
require_once(__DIR__ . '/../../../config/conn.php');

$id_cronograma = $data['id'];

// Preparar una consulta SQL para eliminar el cronograma
$sql = "DELETE FROM Cronograma WHERE id_cronograma = ?";
$stmt = $conn->prepare($sql);
if (!$stmt) {
    echo json_encode(["status" => "error", "message" => "Error en la preparación de la consulta: " . $conn->error]);
    exit;
}

$stmt->bind_param("i", $id_cronograma);

if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "Cronograma eliminado correctamente"]);
} else {
    echo json_encode(["status" => "error", "message" => "Error al eliminar el cronograma: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>