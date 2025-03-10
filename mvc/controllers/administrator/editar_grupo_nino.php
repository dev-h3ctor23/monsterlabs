<?php

require_once(__DIR__ . '/../../../config/conn.php');

header("Content-Type: application/json");

$id_nino = $_GET['id'];
$id_grupo = $_GET['grupo'];

$sql = "UPDATE Nino SET id_grupo = ? WHERE id_nino = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ii", $id_grupo, $id_nino);

if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "Grupo del niño actualizado exitosamente"]);
} else {
    echo json_encode(["status" => "error", "message" => "Error al actualizar el grupo del niño"]);
}

$stmt->close();
$conn->close();
?>