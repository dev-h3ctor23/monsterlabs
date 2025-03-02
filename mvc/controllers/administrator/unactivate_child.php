<?php
session_start();
header("Content-Type: application/json");

if (!isset($_SESSION['id_usuario']) || $_SESSION['tipo_usuario'] !== 'admin') {
    echo json_encode(["status" => "error", "message" => "Acceso denegado"]);
    exit;
}

include(__DIR__ . '/../../../config/conn.php');

$data = json_decode(file_get_contents("php://input"), true);
$id_nino = $data['id_nino'];

$query = "UPDATE Nino SET estado = 'inactivo' WHERE id_nino = ?";
$stmt = $conn->prepare($query);
if (!$stmt) {
    echo json_encode(["status" => "error", "message" => "Error al preparar la consulta"]);
    exit;
}
$stmt->bind_param("i", $id_nino);

if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "Estado actualizado"]);
} else {
    echo json_encode(["status" => "error", "message" => "Error al actualizar el estado"]);
}

$stmt->close();
$conn->close();
?>