<?php
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");

session_start();
session_unset();

// Eliminar todas las variables de sesión
$_SESSION = array();

// Si se desea destruir también la cookie de sesión
if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000,
        $params["path"], $params["domain"],
        $params["secure"], $params["httponly"]
    );
}

session_destroy();

// Devolver un JSON con un indicador de redirección
echo json_encode([
    "status" => "success",
    "redirect" => "../../index.php"
]);
exit;