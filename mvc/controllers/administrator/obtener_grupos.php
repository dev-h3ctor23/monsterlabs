<?php

require_once(__DIR__ . '/../../../config/conn.php');

header("Content-Type: application/json");

$sql = "SELECT id_grupo, nombre_grupo FROM Grupo";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $grupos = [];
    while ($row = $result->fetch_assoc()) {
        $grupos[] = $row;
    }
    echo json_encode(["status" => "success", "grupos" => $grupos]);
} else {
    echo json_encode(["status" => "error", "message" => "No se encontraron grupos"]);
}

$conn->close();
?>