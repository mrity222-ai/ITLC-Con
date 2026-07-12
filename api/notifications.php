<?php
require_once 'config.php';
require_once 'auth_helper.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    if (isset($_GET['active'])) {
        // Fetch only the single active notification for the public site
        try {
            $stmt = $pdo->query("SELECT * FROM notifications WHERE is_active = 1 LIMIT 1");
            $notification = $stmt->fetch();
            echo json_encode($notification ? $notification : null);
        } catch (\PDOException $e) {
            http_response_code(500);
            echo json_encode(["error" => "Failed to fetch active notification: " . $e->getMessage()]);
        }
    } else {
        // Fetch all notifications for the Admin Panel
        try {
            $stmt = $pdo->query("SELECT * FROM notifications ORDER BY created_at DESC");
            $notifications = $stmt->fetchAll();
            echo json_encode($notifications);
        } catch (\PDOException $e) {
            http_response_code(500);
            echo json_encode(["error" => "Failed to fetch notifications: " . $e->getMessage()]);
        }
    }
} elseif ($method === 'POST') {
    checkAuthOrExit();
    
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    
    $id = isset($data['id']) ? intval($data['id']) : 0;
    $title = isset($data['title']) ? trim($data['title']) : '';
    $message = isset($data['message']) ? trim($data['message']) : '';
    $image = isset($data['image']) ? trim($data['image']) : '';
    $is_active = isset($data['is_active']) ? intval($data['is_active']) : 0;

    if (empty($title) || empty($message)) {
        http_response_code(400);
        echo json_encode(["error" => "Notification title and message are required."]);
        exit();
    }

    try {
        if ($id > 0) {
            // Update
            $stmt = $pdo->prepare("UPDATE notifications SET title = ?, message = ?, image = ?, is_active = ? WHERE id = ?");
            $stmt->execute([$title, $message, $image, $is_active, $id]);
            $targetId = $id;
            $msg = "Notification updated successfully!";
        } else {
            // Insert
            $stmt = $pdo->prepare("INSERT INTO notifications (title, message, image, is_active) VALUES (?, ?, ?, ?)");
            $stmt->execute([$title, $message, $image, $is_active]);
            $targetId = $pdo->lastInsertId();
            $msg = "Notification added successfully!";
        }

        // enforce that ONLY ONE notification can be active at a time
        if ($is_active === 1) {
            $deactivateStmt = $pdo->prepare("UPDATE notifications SET is_active = 0 WHERE id != ?");
            $deactivateStmt->execute([$targetId]);
        }

        echo json_encode(["success" => true, "message" => $msg, "id" => $targetId]);
    } catch (\PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Database error: " . $e->getMessage()]);
    }
} elseif ($method === 'DELETE') {
    checkAuthOrExit();
    
    $id = isset($_GET['id']) ? intval($_GET['id']) : 0;
    
    if ($id <= 0) {
        http_response_code(400);
        echo json_encode(["error" => "Invalid Notification ID."]);
        exit();
    }
    
    try {
        $stmt = $pdo->prepare("DELETE FROM notifications WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(["success" => true, "message" => "Notification deleted successfully!"]);
    } catch (\PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Database error: " . $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(["error" => "Method Not Allowed."]);
}
?>
