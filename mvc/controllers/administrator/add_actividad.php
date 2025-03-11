<?php
require_once(__DIR__ . '/../../../config/conn.php');

header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

if ($conn && isset($data['nombre_actividad']) && isset($data['descripcion'])) {
    $nombre_actividad = $data['nombre_actividad'];
    $descripcion = $data['descripcion'];

    $sql = "INSERT INTO Actividad (nombre_actividad, descripcion) VALUES (?, ?)";
    $stmt = $conn->prepare($sql);

    if ($stmt) {
        $stmt->bind_param("ss", $nombre_actividad, $descripcion);
        if ($stmt->execute()) {
            echo json_encode(array("success" => true, "id_actividad" => $stmt->insert_id));
        } else {
            echo json_encode(array("error" => "Error al ejecutar la consulta"));
        }
        $stmt->close();
    } else {
        echo json_encode(array("error" => "Error en la preparación de la consulta"));
    }

    $conn->close();
} else {
    echo json_encode(array("error" => "Conexión fallida o datos incompletos"));
}
?>