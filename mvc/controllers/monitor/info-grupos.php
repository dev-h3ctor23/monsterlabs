<?php
session_start();
header("Content-Type: application/json");

if (!isset($_SESSION['id_usuario']) || $_SESSION['tipo_usuario'] !== 'monitor') {
    echo json_encode(["status" => "error", "message" => "Acceso denegado", "redirect" => "/monsterlabs/index.php"]);
    exit;
}

require_once(__DIR__ . '/../../../config/conn.php');

$user_id = $_SESSION['id_usuario'];

// Obtener el ID del monitor y su grupo
$stmt = $conn->prepare("SELECT id_monitor, id_grupo FROM Monitor WHERE id_usuario = ?");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$stmt->store_result();
$stmt->bind_result($monitor_id, $grupo_id);

if ($stmt->num_rows > 0) {
    $stmt->fetch();
} else {
    echo json_encode(['status' => 'error', 'message' => 'Monitor no encontrado']);
    exit;
}
$stmt->close();

// Obtener los datos de los niños en el grupo del monitor
$stmt1 = $conn->prepare("SELECT id_nino, nombre, apellido, fecha_nacimiento, periodo, id_padre FROM Nino WHERE id_grupo = ?");
$stmt1->bind_param("i", $grupo_id);
$stmt1->execute();
$stmt1->store_result();
$stmt1->bind_result($id_nino, $nombre_nino, $apellido_nino, $fecha_nacimiento, $periodo, $id_padre);

$ninos = [];

while ($stmt1->fetch()) {
    // Obtener los datos del padre
    $stmt2 = $conn->prepare("SELECT nombre, apellido, dni_padre, numero_telefono FROM Padre WHERE id_padre = ?");
    $stmt2->bind_param("i", $id_padre);
    $stmt2->execute();
    $stmt2->store_result();
    $stmt2->bind_result($nombre_padre, $apellido_padre, $dni_padre, $telefono);

    if ($stmt2->num_rows > 0) {
        $stmt2->fetch();
    } else {
        $nombre_padre = $apellido_padre = $dni_padre = $telefono = "No disponible";
    }
    $stmt2->close();

    // Obtener los datos del guardián
    $stmt3 = $conn->prepare("SELECT g.nombre, g.apellido, g.dni_guardian, g.telefono 
                             FROM Guardian g
                             INNER JOIN GuardianNino gn ON g.id_guardian = gn.id_guardian
                             WHERE gn.id_nino = ?");
    $stmt3->bind_param("i", $id_nino);
    $stmt3->execute();
    $stmt3->store_result();
    $stmt3->bind_result($nombre_guardian, $apellido_guardian, $dni_guardian, $telefono_guardian);

    if ($stmt3->num_rows > 0) {
        $stmt3->fetch();
    } else {
        $nombre_guardian = $apellido_guardian = $dni_guardian = $telefono_guardian = "No disponible";
    }
    $stmt3->close();

    // Obtener los datos de la ficha médica
    $stmt4 = $conn->prepare("SELECT alimentos_alergico, medicamentos_alergico, medicamentos_actuales FROM FichaMedica WHERE id_nino = ?");
    $stmt4->bind_param("i", $id_nino);
    $stmt4->execute();
    $stmt4->store_result();
    $stmt4->bind_result($alimentos_alergico, $medicamentos_alergico, $medicamentos_actuales);

    if ($stmt4->num_rows > 0) {
        $stmt4->fetch();
    } else {
        $alimentos_alergico = $medicamentos_alergico = $medicamentos_actuales = "Sin registro";
    }
    $stmt4->close();

    // Almacenar los datos del niño, padre, guardián y ficha médica
    $ninos[] = [
        "nino" => [
            "nombre_nino" => $nombre_nino,
            "apellido_nino" => $apellido_nino,
            "fecha_nacimiento" => $fecha_nacimiento,
            "periodo" => $periodo
        ],
        "padre" => [
            "nombre_padre" => $nombre_padre,
            "apellido_padre" => $apellido_padre,
            "dni_padre" => $dni_padre,
            "telefono" => $telefono
        ],
        "guardian" => [
            "nombre_guardian" => $nombre_guardian,
            "apellido_guardian" => $apellido_guardian,
            "dni_guardian" => $dni_guardian,
            "telefono_guardian" => $telefono_guardian
        ],
        "ficha_medica" => [
            "alimentos_alergico" => $alimentos_alergico,
            "medicamentos_alergico" => $medicamentos_alergico,
            "medicamentos_actuales" => $medicamentos_actuales
        ]
    ];
}

$stmt1->close();
$conn->close();

// Devolver los datos en formato JSON
echo json_encode(["status" => "success", "ninos" => $ninos]);
?>