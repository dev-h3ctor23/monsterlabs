<?php

require_once(__DIR__ . '/../../../config/conn.php');

header("Content-Type: application/json");

$sql = "SELECT nombre, apellido FROM Nino WHERE estado = 'activo'";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $ninos = [];
    while ($row = $result->fetch_assoc()) {
        $ninos[] = $row;
    }
    echo json_encode(["status" => "success", "ninos" => $ninos]);
} else {
    echo json_encode(["status" => "error", "message" => "No se encontraron niños activos"]);
}

$conn->close();
?>