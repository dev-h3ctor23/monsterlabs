<?php
// filepath: /C:/xampp/htdocs/monsterlabs/mvc/controllers/administrator/delete_group.php

header("Content-Type: application/json");

// Conexión a la base de datos
include_once '../../../config/conn.php';

// Verificar si se ha enviado el ID del grupo
if (isset($_GET['id'])) {
    $groupId = $_GET['id'];

    // Preparar la consulta SQL para eliminar el grupo
    $stmt = $conn->prepare("DELETE FROM Grupo WHERE id_grupo = ?");
    $stmt->bind_param("i", $groupId);

    if ($stmt->execute()) {
        // Respuesta de éxito sin mensaje
        // echo json_encode(["status" => "success"]);
    } else {
        // Respuesta de error sin mensaje
        // echo json_encode(["status" => "error"]);
    }

    $stmt->close();
} else {
    // Respuesta de error sin mensaje si no se ha enviado el ID del grupo
    // echo json_encode(["status" => "error"]);
}

$conn->close();
?>