<?php
// filepath: /C:/xampp/htdocs/monsterlabs/mvc/controllers/administrator/get_children_and_monitors.php

session_start();
header("Content-Type: application/json");

if (!isset($_SESSION['id_usuario']) || $_SESSION['tipo_usuario'] !== 'admin') {
    echo json_encode(["status" => "error", "message" => "Acceso denegado"]);
    exit;
}

include(__DIR__ . '/../../../config/conn.php');

// Obtener niños activos
$childrenQuery = "SELECT id_nino, nombre, apellido FROM Nino WHERE estado = 'activo'";
$childrenResult = $conn->query($childrenQuery);

$children = [];
if ($childrenResult->num_rows > 0) {
    while ($row = $childrenResult->fetch_assoc()) {
        $children[] = $row;
    }
}

// Obtener monitores
$monitorsQuery = "SELECT id_monitor, nombre, apellido FROM Monitor";
$monitorsResult = $conn->query($monitorsQuery);

$monitors = [];
if ($monitorsResult->num_rows > 0) {
    while ($row = $monitorsResult->fetch_assoc()) {
        $monitors[] = $row;
    }
}

$conn->close();

echo json_encode(["status" => "success", "children" => $children, "monitors" => $monitors]);
?>