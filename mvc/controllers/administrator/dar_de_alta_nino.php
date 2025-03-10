<?php

require_once(__DIR__ . '/../../../config/conn.php');

header("Content-Type: application/json");

$id_nino = $_GET['id'];

$sql = "UPDATE Nino SET estado = 'activo' WHERE id_nino = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $id_nino);

if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "Niño dado de alta exitosamente"]);
} else {
    echo json_encode(["status" => "error", "message" => "Error al dar de alta al niño"]);
}

$stmt->close();
$conn->close();
?>