<?php

require_once(__DIR__ . '/../../../config/conn.php');

header("Content-Type: application/json");

$id_nino = $_GET['id'];

// Obtener datos del niño
$sqlNino = "SELECT * FROM Nino WHERE id_nino = ?";
$stmtNino = $conn->prepare($sqlNino);
$stmtNino->bind_param("i", $id_nino);
$stmtNino->execute();
$resultNino = $stmtNino->get_result();
$nino = $resultNino->fetch_assoc();

// Obtener datos del padre
$sqlPadre = "SELECT nombre, apellido, numero_telefono FROM Padre WHERE id_padre = ?";
$stmtPadre = $conn->prepare($sqlPadre);
$stmtPadre->bind_param("i", $nino['id_padre']);
$stmtPadre->execute();
$resultPadre = $stmtPadre->get_result();
$padre = $resultPadre->fetch_assoc();

// Obtener datos del grupo
$sqlGrupo = "SELECT nombre_grupo FROM Grupo WHERE id_grupo = ?";
$stmtGrupo = $conn->prepare($sqlGrupo);
$stmtGrupo->bind_param("i", $nino['id_grupo']);
$stmtGrupo->execute();
$resultGrupo = $stmtGrupo->get_result();
$grupo = $resultGrupo->fetch_assoc();

// Obtener datos de la ficha médica
$sqlFichaMedica = "SELECT * FROM FichaMedica WHERE id_nino = ?";
$stmtFichaMedica = $conn->prepare($sqlFichaMedica);
$stmtFichaMedica->bind_param("i", $id_nino);
$stmtFichaMedica->execute();
$resultFichaMedica = $stmtFichaMedica->get_result();
$fichaMedica = $resultFichaMedica->fetch_assoc();

// Obtener datos del guardian
$sqlGuardian = "SELECT g.nombre, g.apellido, gn.relacion FROM Guardian g JOIN GuardianNino gn ON g.id_guardian = gn.id_guardian WHERE gn.id_nino = ?";
$stmtGuardian = $conn->prepare($sqlGuardian);
$stmtGuardian->bind_param("i", $id_nino);
$stmtGuardian->execute();
$resultGuardian = $stmtGuardian->get_result();
$guardian = $resultGuardian->fetch_assoc();

$response = [
    "status" => "success",
    "nino" => $nino,
    "padre" => $padre,
    "grupo" => $grupo,
    "fichaMedica" => $fichaMedica,
    "guardian" => $guardian
];

echo json_encode($response);

$stmtNino->close();
$stmtPadre->close();
$stmtGrupo->close();
$stmtFichaMedica->close();
$stmtGuardian->close();
$conn->close();
?>