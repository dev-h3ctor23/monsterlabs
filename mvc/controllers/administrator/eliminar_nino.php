<?php

require_once(__DIR__ . '/../../../config/conn.php');

header("Content-Type: application/json");

$id_nino = $_GET['id'];

$sql = "DELETE FROM Nino WHERE id_nino = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $id_nino);

if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "Niño eliminado exitosamente"]);
} else {
    echo json_encode(["status" => "error", "message" => "Error al eliminar al niño"]);
}

$stmt->close();
$conn->close();
?>