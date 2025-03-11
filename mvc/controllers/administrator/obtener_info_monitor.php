<?php
header('Content-Type: application/json');

require_once 'c:\xampp\htdocs\monsterlabs\config\conn.php';

$id_monitor = $_GET['id'];

$sql = "SELECT nombre, apellido, dni_monitor, numero_telefono FROM Monitor WHERE id_monitor = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param('i', $id_monitor);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $monitor = $result->fetch_assoc();
    echo json_encode(['status' => 'success', 'monitor' => $monitor]);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Monitor no encontrado']);
}

$stmt->close();
$conn->close();