<?php
session_start();
header("Content-Type: application/json");

error_log("Inicio del script delete_child.php");

if (!isset($_SESSION['id_usuario']) || $_SESSION['tipo_usuario'] !== 'admin') {
    error_log("Acceso denegado: Usuario no autenticado o no es administrador");
    echo json_encode(["status" => "error", "message" => "Acceso denegado"]);
    exit;
}

include(__DIR__ . '/../../../config/conn.php');

$data = json_decode(file_get_contents("php://input"), true);
$id_nino = $data['id_nino'];

error_log("ID del niño a eliminar: $id_nino");

$query = "DELETE FROM Nino WHERE id_nino = ?";
$stmt = $conn->prepare($query);
if (!$stmt) {
    error_log("Error al preparar la consulta: " . $conn->error);
    echo json_encode(["status" => "error", "message" => "Error al preparar la consulta"]);
    exit;
}
$stmt->bind_param("i", $id_nino);

if ($stmt->execute()) {
    error_log("Niño eliminado correctamente");
    echo json_encode(["status" => "success", "message" => "Niño eliminado"]);
} else {
    error_log("Error al eliminar el niño: " . $stmt->error);
    echo json_encode(["status" => "error", "message" => "Error al eliminar el niño"]);
}

$stmt->close();
$conn->close();
error_log("Fin del script delete_child.php");
?>