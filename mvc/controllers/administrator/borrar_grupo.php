<?php

require_once(__DIR__ . '/../../../config/conn.php');

header("Content-Type: application/json");

if (isset($_GET['id']) && !empty($_GET['id'])) {
    $id_grupo = intval($_GET['id']);

    // Preparar la declaración SQL
    $stmt = $conn->prepare("DELETE FROM Grupo WHERE id_grupo = ?");
    if ($stmt) {
        // Vincular los parámetros
        $stmt->bind_param("i", $id_grupo);

        // Ejecutar la declaración
        if ($stmt->execute()) {
            echo json_encode(["status" => "success", "message" => "Grupo eliminado correctamente."]);
        } else {
            echo json_encode(["status" => "error", "message" => "Error al eliminar el grupo: " . $stmt->error]);
        }

        // Cerrar la declaración
        $stmt->close();
    } else {
        echo json_encode(["status" => "error", "message" => "Error al preparar la declaración: " . $conn->error]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "El ID del grupo es obligatorio."]);
}

$conn->close();
?>