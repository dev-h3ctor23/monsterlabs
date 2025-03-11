<?php
require_once(__DIR__ . '/../../../config/conn.php');

header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

if ($conn && isset($data['id_actividad'])) {
    $id_actividad = $data['id_actividad'];

    $sql = "DELETE FROM Actividad WHERE id_actividad = ?";
    $stmt = $conn->prepare($sql);

    if ($stmt) {
        $stmt->bind_param("i", $id_actividad);
        if ($stmt->execute()) {
            echo json_encode(array("success" => true));
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