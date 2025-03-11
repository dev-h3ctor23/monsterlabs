<?php
require_once(__DIR__ . '/../../../config/conn.php');

header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

if ($conn) {
    $sql = "SELECT id_actividad, nombre_actividad, descripcion FROM Actividad";
    $stmt = $conn->prepare($sql);

    if ($stmt) {
        $stmt->execute();
        $result = $stmt->get_result();

        $actividades = array();
        if ($result->num_rows > 0) {
            while($row = $result->fetch_assoc()) {
                $actividades[] = $row;
            }
        }

        echo json_encode($actividades);
        $stmt->close();
    } else {
        echo json_encode(array("error" => "Error en la preparación de la consulta"));
    }

    $conn->close();
} else {
    echo json_encode(array("error" => "Conexión fallida"));
}
?>