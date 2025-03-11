<?php
header('Content-Type: application/json');

require_once 'c:\xampp\htdocs\monsterlabs\config\conn.php';

$username = $_GET['username'];

$sql = "SELECT id_usuario FROM Usuario WHERE nombre_usuario = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param('s', $username);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows > 0) {
    echo json_encode(['exists' => true]);
} else {
    echo json_encode(['exists' => false]);
}

$stmt->close();
$conn->close();