<?php
// filepath: /C:/xampp/htdocs/monsterlabs/mvc/controllers/administrator/get_activities.php

header("Content-Type: application/json");

// Conexión a la base de datos
include_once '../../../config/conn.php';

// Preparar la consulta SQL para obtener las actividades
$stmt = $conn->prepare("SELECT nombre_actividad, descripcion FROM Actividad");

if ($stmt->execute()) {
    $result = $stmt->get_result();
    $activities = [];

    while ($row = $result->fetch_assoc()) {
        $activities[] = $row;
    }

    // Respuesta de éxito con las actividades
    echo json_encode(["status" => "success", "activities" => $activities]);
} else {
    // Respuesta de error
    echo json_encode(["status" => "error", "message" => "Error al obtener las actividades"]);
}

$stmt->close();
$conn->close();
?>