<?php

require_once(__DIR__ . '/../../../config/conn.php');

header("Content-Type: application/json");

if ($conn) {
    $sql = "SELECT id_grupo, nombre_grupo FROM Grupo";
    $stmt = $conn->prepare($sql);

    if ($stmt) {
        $stmt->execute();
        $result = $stmt->get_result();

        $grupos = array();
        if ($result->num_rows > 0) {
            while($row = $result->fetch_assoc()) {
                $grupos[] = $row;
            }
        }

        echo json_encode($grupos);
        $stmt->close();
    } else {
        echo json_encode(array("error" => "Error en la preparación de la consulta"));
    }

    $conn->close();
} else {
    echo json_encode(array("error" => "Conexión fallida"));
}
?>