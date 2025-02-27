<?php
session_start();
header("Content-Type: application/json");

if (!isset($_SESSION['id_usuario']) || $_SESSION['tipo_usuario'] !== 'admin') {
    echo json_encode(["status" => "error", "message" => "Acceso denegado"]);
    exit;
}

include(__DIR__ . '/../../../config/conn.php');

$query = "SELECT id_nino, nombre, apellido, fecha_nacimiento FROM Nino WHERE estado = 'activo'";
$result = $conn->query($query);

if ($result->num_rows > 0) {
    $children = [];
    while ($row = $result->fetch_assoc()) {
        $children[] = $row;
    }
    echo json_encode(["status" => "success", "children" => $children]);
} else {
    echo json_encode(["status" => "error", "message" => "No hay niños activos"]);
}

$conn->close();
?>