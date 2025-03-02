<?php
session_start();
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    echo json_encode(["status" => "error", "message" => "Método no permitido"]);
    exit;
}

if (!isset($_SESSION['id_usuario']) || $_SESSION['tipo_usuario'] !== 'admin') {
    echo json_encode(["status" => "error", "message" => "Acceso denegado"]);
    exit;
}

include(__DIR__ . '/../../../config/conn.php');

parse_str(file_get_contents("php://input"), $data);
$id = $data['id'];

if (empty($id)) {
    echo json_encode(["status" => "error", "message" => "ID de monitor no proporcionado"]);
    exit;
}

// Eliminar el monitor de la base de datos
$stmt = $conn->prepare("DELETE FROM Monitor WHERE id_usuario = ?");
$stmt->bind_param("i", $id);

if ($stmt->execute()) {
    // También eliminar el usuario correspondiente
    $stmt2 = $conn->prepare("DELETE FROM Usuario WHERE id_usuario = ?");
    $stmt2->bind_param("i", $id);
    $stmt2->execute();
    $stmt2->close();

    echo json_encode(["status" => "success", "message" => "Monitor eliminado con éxito"]);
} else {
    echo json_encode(["status" => "error", "message" => "Error al eliminar el monitor"]);
}

$stmt->close();
$conn->close();
?>