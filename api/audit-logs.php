<?php
require_once 'config.php';
require_once 'auth_helper.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    checkAuthOrExit();
    
    try {
        $stmt = $pdo->query("SELECT * FROM audit_logs ORDER BY timestamp DESC");
        $logs = $stmt->fetchAll();
        echo json_encode($logs);
    } catch (\PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Failed to fetch audit logs: " . $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(["error" => "Method Not Allowed."]);
}
?>
