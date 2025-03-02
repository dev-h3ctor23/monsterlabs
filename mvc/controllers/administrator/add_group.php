<?php
// filepath: /c:/xampp/htdocs/monsterlabs/mvc/controllers/administrator/add_group.php

header("Content-Type: application/json");

// Conexión a la base de datos
include_once '../../../config/conn.php';

// Verificar si se ha enviado el nombre del grupo
if (isset($_POST['group_name'])) {
    $groupName = $_POST['group_name'];

    // Preparar la consulta SQL para insertar el nuevo grupo
    $stmt = $conn->prepare("INSERT INTO Grupo (nombre_grupo) VALUES (?)");
    $stmt->bind_param("s", $groupName);

    if ($stmt->execute()) {
        // Respuesta de éxito
        echo json_encode(["status" => "success", "message" => "Grupo añadido con éxito"]);
    } else {
        // Respuesta de error
        echo json_encode(["status" => "error", "message" => "Error al añadir el grupo"]);
    }

    $stmt->close();
} else {
    // Respuesta de error si no se ha enviado el nombre del grupo
    echo json_encode(["status" => "error", "message" => "Nombre del grupo no proporcionado"]);
}

$conn->close();
?>