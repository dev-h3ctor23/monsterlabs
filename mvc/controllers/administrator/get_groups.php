<?php
// filepath: /c:/xampp/htdocs/monsterlabs/mvc/controllers/administrator/get_groups.php

header("Content-Type: application/json");

// Conexión a la base de datos
include_once '../../../config/conn.php';

// Consulta para obtener los grupos
$sql = "SELECT id_grupo, nombre_grupo FROM Grupo";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $groups = [];
    while($row = $result->fetch_assoc()) {
        $groups[] = $row;
    }
    echo json_encode(["status" => "success", "groups" => $groups]);
} else {
    echo json_encode(["status" => "error", "message" => "No se encontraron grupos"]);
}

$conn->close();
?>