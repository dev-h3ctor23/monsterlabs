<?php
session_start();
session_unset();
session_destroy();

// Devolver un JSON con un indicador de redirección
echo json_encode([
    "status" => "success",
    "redirect" => "/monsterlabs/index.php"
]);
exit;