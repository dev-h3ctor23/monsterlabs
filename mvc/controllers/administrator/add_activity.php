<?php
// filepath: /C:/xampp/htdocs/monsterlabs/mvc/controllers/administrator/add_activity.php

header("Content-Type: application/json");

// Conexión a la base de datos
include_once '../../../config/conn.php';

// Verificar si se han enviado los datos de la actividad
if (isset($_POST['activity_name']) && isset($_POST['activity_description'])) {
    $activityName = $_POST['activity_name'];
    $activityDescription = $_POST['activity_description'];

    // Preparar la consulta SQL para insertar la actividad
    $stmt = $conn->prepare("INSERT INTO Actividad (nombre_actividad, descripcion) VALUES (?, ?)");
    $stmt->bind_param("ss", $activityName, $activityDescription);

    if ($stmt->execute()) {
        // Respuesta de éxito
        echo json_encode(["status" => "success"]);
    } else {
        // Respuesta de error
        echo json_encode(["status" => "error"]);
    }

    $stmt->close();
} else {
    // Respuesta de error si no se han enviado los datos de la actividad
    echo json_encode(["status" => "error"]);
}

$conn->close();
?>