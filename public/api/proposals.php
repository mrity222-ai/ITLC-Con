<?php
require_once 'config.php';
require_once 'auth_helper.php';

// All operations on proposals require admin authentication
checkAuthOrExit();

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    try {
        $stmt = $pdo->query("SELECT * FROM contact_proposals ORDER BY created_at DESC");
        $proposals = $stmt->fetchAll();
        echo json_encode($proposals);
    } catch (\PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Failed to fetch proposals: " . $e->getMessage()]);
    }
} elseif ($method === 'POST') {
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    
    $id = isset($data['id']) ? intval($data['id']) : 0;
    $status = isset($data['status']) ? trim($data['status']) : '';
    $action = isset($data['action']) ? trim($data['action']) : 'update_status';
    
    if ($id <= 0) {
        http_response_code(400);
        echo json_encode(["error" => "Invalid Proposal ID."]);
        exit();
    }
    
    try {
        if ($action === 'delete') {
            $stmt = $pdo->prepare("DELETE FROM contact_proposals WHERE id = ?");
            $stmt->execute([$id]);
            echo json_encode(["success" => true, "message" => "Proposal deleted successfully!"]);
        } else {
            // Update Status
            if (empty($status)) {
                http_response_code(400);
                echo json_encode(["error" => "Status is required for update."]);
                exit();
            }
            $stmt = $pdo->prepare("UPDATE contact_proposals SET status = ? WHERE id = ?");
            $stmt->execute([$status, $id]);
            echo json_encode(["success" => true, "message" => "Proposal status updated to '$status'!"]);
        }
    } catch (\PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Database error: " . $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(["error" => "Method Not Allowed."]);
}
?>
