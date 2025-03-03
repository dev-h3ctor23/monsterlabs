<?php
// filepath: /C:/xampp/htdocs/monsterlabs/mvc/controllers/administrator/update_child_group.php
require_once '../../../config/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $childId = $_POST['child_id'];
    $groupId = $_POST['group_id'];

    if (empty($childId) || empty($groupId)) {
        echo json_encode(['status' => 'error', 'message' => 'Faltan datos requeridos.']);
        exit;
    }

    $query = "UPDATE Nino SET id_grupo = ? WHERE id_nino = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param('ii', $groupId, $childId);

    if ($stmt->execute()) {
        echo json_encode(['status' => 'success', 'message' => 'Grupo actualizado correctamente.']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Error al actualizar el grupo.']);
    }

    $stmt->close();
    $conn->close();
} else {
    echo json_encode(['status' => 'error', 'message' => 'Método no permitido.']);
}
?>