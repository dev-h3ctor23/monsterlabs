<?php
require_once(__DIR__ . '/../../../config/conn.php');

header("Content-Type: application/json");

$sql = "SELECT id_nino, nombre, apellido, fecha_nacimiento, periodo, estado FROM Nino WHERE estado = 'inactivo'";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $ninos = array();
    while ($row = $result->fetch_assoc()) {
        $ninos[] = $row;
    }
    echo json_encode(["status" => "success", "ninos" => $ninos]);
} else {
    echo json_encode(["status" => "error", "message" => "No se encontraron niños inactivos"]);
}

$conn->close();
?>