<?php

/**
 * Establecer encabezados HTTP para evitar el almacenamiento en caché de la respuesta.
 * 
 * Se establecen los siguientes encabezados:
 * - Cache-Control: no-store, no-cache, must-revalidate, max-age=0
 *   Asegura que la respuesta no sea almacenada en caché por el navegador o cualquier caché intermedia.
 * - Cache-Control: post-check=0, pre-check=0
 *   Directivas adicionales para controlar el comportamiento del caché, asegurando que no ocurra almacenamiento en caché.
 * - Pragma: no-cache
 *   Encabezado de compatibilidad con HTTP/1.0 para evitar el almacenamiento en caché.
 */

header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");

/**
 * Iniciar la sesión de PHP.
 */

session_start();
header("Content-Type: application/json");

/**
 * Verificar si el usuario ha iniciado sesión y si es de tipo 'admin'.
 * 
 * Si el usuario no ha iniciado sesión o no es de tipo 'admin', se retorna un mensaje de error y se redirecciona al usuario a la página de inicio de sesión.
 */

if (!isset($_SESSION['id_usuario']) || $_SESSION['tipo_usuario'] !== 'admin') {
    
    echo json_encode(["status" => "error", "message" => "Acceso denegado", "redirect" => "../../views/log-in.html"]);
    exit;
}

/**
 * Incluir el archivo de conexión a la base de datos.
 */

require_once(__DIR__ . '/../../../config/conn.php');

$user_id = $_SESSION['id_usuario'];

/**
 * Preparar una consulta SQL para obtener la información del usuario.
 */

$stmt = $conn->prepare("SELECT nombre_usuario, correo, nombre_tipo, foto FROM Usuario WHERE id_usuario = ?");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$stmt->store_result();
$stmt->bind_result($username, $email, $user_type, $foto);

if ($stmt->num_rows > 0) {
    $stmt->fetch();
    $stmt2 = $conn->prepare("SELECT dni_admin, nombre, apellido, numero_telefono FROM Administrador WHERE id_usuario = ?");
    $stmt2->bind_param("i", $user_id);
    $stmt2->execute();
    $stmt2->store_result();
    $stmt2->bind_result($dni, $nombre, $apellido, $telefono);

    if ($stmt2->num_rows > 0) {
        $stmt2->fetch();
        echo json_encode([
            "status" => "success",
            "usuario" => ["username" => $username, "email" => $email, "user_type" => $user_type, "foto" => $foto],
            "admin" => ["dni" => $dni, "nombre" => $nombre, "apellido" => $apellido, "telefono" => $telefono]
        ]);
    } else {
        echo json_encode(["status" => "error", "message" => "No se encontró información del administrador"]);
    }

    $stmt2->close();
} else {
    echo json_encode(["status" => "error", "message" => "No se encontró información del usuario"]);
}

$stmt->close();
$conn->close();
?>
