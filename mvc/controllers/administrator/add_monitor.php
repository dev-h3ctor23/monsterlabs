<?php
session_start();
header("Content-Type: application/json");

if (!isset($_SESSION['id_usuario']) || $_SESSION['tipo_usuario'] !== 'admin') {
    echo json_encode(["status" => "error", "message" => "Acceso denegado"]);
    exit;
}

include(__DIR__ . '/../../../config/conn.php');

$data = json_decode(file_get_contents("php://input"), true);

$username = $data['username'];
$name = $data['name'];
$surname = $data['surname'];
$dni = $data['dni'];
$phone = $data['phone'];
$email = $data['email'];
$password = password_hash($data['password'], PASSWORD_DEFAULT);

// Validar los datos recibidos
if (empty($username) || empty($name) || empty($surname) || empty($dni) || empty($phone) || empty($email) || empty($password)) {
    echo json_encode(["status" => "error", "message" => "Todos los campos son obligatorios"]);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(["status" => "error", "message" => "El formato del correo electrónico no es válido"]);
    exit;
}

if (!preg_match('/^[0-9]{9}$/', $phone)) {
    echo json_encode(["status" => "error", "message" => "El número de teléfono debe contener 9 números"]);
    exit;
}

if (!preg_match('/^[0-9]{8}[A-Z]$/', $dni)) {
    echo json_encode(["status" => "error", "message" => "El formato del DNI no es válido"]);
    exit;
}

// Verificar si el nombre de usuario ya existe
$stmt = $conn->prepare("SELECT id_usuario FROM Usuario WHERE nombre_usuario = ?");
$stmt->bind_param("s", $username);
$stmt->execute();
$stmt->store_result();
if ($stmt->num_rows > 0) {
    echo json_encode(["status" => "error", "message" => "El nombre de usuario ya existe"]);
    $stmt->close();
    $conn->close();
    exit;
}
$stmt->close();

// Verificar si el correo electrónico ya existe
$stmt = $conn->prepare("SELECT id_usuario FROM Usuario WHERE correo = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$stmt->store_result();
if ($stmt->num_rows > 0) {
    echo json_encode(["status" => "error", "message" => "El correo electrónico ya existe"]);
    $stmt->close();
    $conn->close();
    exit;
}
$stmt->close();

// Verificar si el DNI ya existe
$stmt = $conn->prepare("SELECT id_monitor FROM Monitor WHERE dni_monitor = ?");
$stmt->bind_param("s", $dni);
$stmt->execute();
$stmt->store_result();
if ($stmt->num_rows > 0) {
    echo json_encode(["status" => "error", "message" => "El DNI ya existe"]);
    $stmt->close();
    $conn->close();
    exit;
}
$stmt->close();

// Insertar en la tabla Usuario
$stmt = $conn->prepare("INSERT INTO Usuario (nombre_usuario, correo, contrasena, nombre_tipo) VALUES (?, ?, ?, 'monitor')");
$stmt->bind_param("sss", $username, $email, $password);

if ($stmt->execute()) {
    $user_id = $stmt->insert_id;

    // Insertar en la tabla Monitor
    $stmt2 = $conn->prepare("INSERT INTO Monitor (id_usuario, nombre, apellido, dni_monitor, numero_telefono) VALUES (?, ?, ?, ?, ?)");
    $stmt2->bind_param("issss", $user_id, $name, $surname, $dni, $phone);

    if ($stmt2->execute()) {
        echo json_encode(["status" => "success", "message" => "Monitor añadido con éxito", "monitor" => ["id_usuario" => $user_id, "nombre" => $name, "apellido" => $surname]]);
    } else {
        echo json_encode(["status" => "error", "message" => "Error al insertar en la tabla Monitor"]);
    }

    $stmt2->close();
} else {
    echo json_encode(["status" => "error", "message" => "Error al insertar en la tabla Usuario"]);
}

$stmt->close();
$conn->close();
?>