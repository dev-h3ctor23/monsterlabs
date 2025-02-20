<?php
// Inicializar la base de datos (si aún no existe)
include 'config/init-database.php';

// Redirigir a home.html
header("Location: mvc/views/home.html");
exit();
?>