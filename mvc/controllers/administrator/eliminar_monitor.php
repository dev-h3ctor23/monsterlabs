<?php
header('Content-Type: application/json');

require_once 'c:\xampp\htdocs\monsterlabs\config\conn.php';

$data = json_decode(file_get_contents('php://input'), true);
$id_monitor = $data['id_monitor'];

$sql = "DELETE FROM Monitor WHERE id_monitor = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param('i', $id_monitor);

if ($stmt->execute()) {
    echo json_encode(['status' => 'success']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Error al eliminar el monitor']);
}

$stmt->close();
$conn->close();