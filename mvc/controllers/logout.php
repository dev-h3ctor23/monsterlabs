<?php
session_start();
session_unset();
session_destroy();
header("Location: /monsterlabs/index.php"); 
exit;