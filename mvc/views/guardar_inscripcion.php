<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
// Habilitar CORS (si es necesario)
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// Obtener los datos JSON del cuerpo de la solicitud
$jsonData = file_get_contents("php://input");
$data = json_decode($jsonData, true);

// Validar que los datos se recibieron correctamente
if (!$data) {
    http_response_code(400); // Bad Request
    echo json_encode(["success" => false, "message" => "Datos no válidos"]);
    exit;
}

// Extraer los datos del formulario
$nombre = $data['nombre'];
$apellidos = $data['apellidos'];
$fecha_nacimiento = $data['fecha-nacimiento'];
$periodo = $data['periodo'];
$fecha_inicio = $data['fecha-inicio'];
$fecha_fin = $data['fecha-fin'];
$forma_pago = $data['forma-pago'];
$alergia_alimentos = $data['alergia-alimentos'];
$alergia_medicamentos = $data['alergia-medicamentos'];
$medicamento_actual = $data['medicamento-actual'];
$responsable_adicional = $data['responsable-adicional'];

// Datos del responsable adicional (si aplica)
if ($responsable_adicional === "si") {
    $nombre_responsable = $data['nombre-responsable'];
    $apellidos_responsable = $data['apellidos-responsable'];
    $dni_responsable = $data['dni-responsable'];
    $telefono_responsable = $data['telefono-responsable'];
    $relacion_responsable = $data['relacion-responsable'];
}

$dni_padre = 12345789; // Ejemplo de DNI del padre

// Conectar a la base de datos (reemplaza con tus credenciales)
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "prueba_inscripcion";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}



// Guardar los datos en la tabla Nino
$sql = "INSERT INTO Nino (nombre, apellido, fecha_nacimiento, periodo, fecha_inicio, fecha_fin, estado, dni_padre)
        VALUES (?, ?, ?, ?, ?, ?, 'inactivo', ?)";


// Ejemplo con MySQLi
$stmt = $conn->prepare($sql);
if (!$stmt) {
    http_response_code(500); // Internal Server Error
    echo json_encode(["success" => false, "message" => "Error al preparar la consulta: " . $conn->error]);
    exit;
}

$stmt->bind_param("sssssss", $nombre, $apellidos, $fecha_nacimiento, $periodo, $fecha_inicio, $fecha_fin, $dni_padre);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Inscripción guardada correctamente."]);
} else {
    http_response_code(500); // Internal Server Error
    echo json_encode(["success" => false, "message" => "Error al guardar la inscripción: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>