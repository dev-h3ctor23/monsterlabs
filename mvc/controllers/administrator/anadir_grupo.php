<?php

require_once(__DIR__ . '/../../../config/conn.php');

header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['nombre_grupo']) && !empty($data['nombre_grupo'])) {
    $nombre_grupo = $data['nombre_grupo'];

    // Validar que el nombre del grupo no contenga caracteres especiales
    if (!preg_match('/^[a-zA-Z0-9\s]+$/', $nombre_grupo)) {
        echo json_encode(["status" => "error", "message" => "El nombre del grupo no debe contener caracteres especiales."]);
        exit();
    }

    // Preparar la declaración SQL
    $stmt = $conn->prepare("INSERT INTO Grupo (nombre_grupo) VALUES (?)");
    if ($stmt) {
        // Vincular los parámetros
        $stmt->bind_param("s", $nombre_grupo);

        // Ejecutar la declaración
        if ($stmt->execute()) {
            echo json_encode(["status" => "success", "message" => "Grupo añadido correctamente."]);
        } else {
            echo json_encode(["status" => "error", "message" => "Error al añadir el grupo: " . $stmt->error]);
        }

        // Cerrar la declaración
        $stmt->close();
    } else {
        echo json_encode(["status" => "error", "message" => "Error al preparar la declaración: " . $conn->error]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "El nombre del grupo es obligatorio."]);
}

$conn->close();
?>