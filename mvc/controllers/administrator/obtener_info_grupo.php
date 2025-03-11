<?php

require_once(__DIR__ . '/../../../config/conn.php');

header("Content-Type: application/json");

if (isset($_GET['id']) && !empty($_GET['id'])) {
    $id_grupo = intval($_GET['id']);

    // Obtener los monitores del grupo
    $stmtMonitores = $conn->prepare("SELECT nombre, apellido FROM Monitor WHERE id_grupo = ?");
    $stmtMonitores->bind_param("i", $id_grupo);
    $stmtMonitores->execute();
    $resultMonitores = $stmtMonitores->get_result();
    $monitores = $resultMonitores->fetch_all(MYSQLI_ASSOC);
    $stmtMonitores->close();

    // Obtener los campistas del grupo
    $stmtCampistas = $conn->prepare("SELECT nombre, apellido FROM Nino WHERE id_grupo = ?");
    $stmtCampistas->bind_param("i", $id_grupo);
    $stmtCampistas->execute();
    $resultCampistas = $stmtCampistas->get_result();
    $campistas = $resultCampistas->fetch_all(MYSQLI_ASSOC);
    $stmtCampistas->close();

    echo json_encode(["status" => "success", "monitores" => $monitores, "campistas" => $campistas]);
} else {
    echo json_encode(["status" => "error", "message" => "El ID del grupo es obligatorio."]);
}

$conn->close();
?>