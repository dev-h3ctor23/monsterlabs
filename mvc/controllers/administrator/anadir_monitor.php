<?php
header('Content-Type: application/json');

require_once 'c:\xampp\htdocs\monsterlabs\config\conn.php';

// Obtener los datos del formulario
$data = json_decode(file_get_contents('php://input'), true);

$username = $data['username'];
$nombre = $data['nombre'];
$apellido = $data['apellido'];
$dni = $data['dni'];
$telefono = $data['telefono'];
$correo = $data['correo'];
$contrasena = $data['contrasena'];

// Validar que los campos no estén vacíos
if (empty($username) || empty($nombre) || empty($apellido) || empty($dni) || empty($telefono) || empty($correo) || empty($contrasena)) {
    echo json_encode(['status' => 'error', 'message' => 'Todos los campos son obligatorios']);
    exit;
}

// Validar que el nombre de usuario no exista
$sql = "SELECT id_usuario FROM Usuario WHERE nombre_usuario = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param('s', $username);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows > 0) {
    echo json_encode(['status' => 'error', 'message' => 'El nombre de usuario ya existe']);
    $stmt->close();
    $conn->close();
    exit;
}
$stmt->close();

// Encriptar la contraseña
$contrasena_encriptada = password_hash($contrasena, PASSWORD_BCRYPT);

// Insertar el nuevo monitor en la base de datos
$sql = "INSERT INTO Usuario (nombre_usuario, contrasena, correo, nombre_tipo) VALUES (?, ?, ?, 'monitor')";
$stmt = $conn->prepare($sql);
$stmt->bind_param('sss', $username, $contrasena_encriptada, $correo);

if ($stmt->execute()) {
    $id_usuario = $stmt->insert_id;
    $stmt->close();

    $sql = "INSERT INTO Monitor (id_usuario, nombre, apellido, dni_monitor, numero_telefono) VALUES (?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('issss', $id_usuario, $nombre, $apellido, $dni, $telefono);

    if ($stmt->execute()) {
        echo json_encode(['status' => 'success', 'message' => 'Monitor añadido correctamente']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Error al añadir el monitor']);
    }
    $stmt->close();
} else {
    echo json_encode(['status' => 'error', 'message' => 'Error al añadir el usuario']);
}

$conn->close();