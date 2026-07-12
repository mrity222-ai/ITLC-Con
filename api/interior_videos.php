<?php
require_once 'config.php';
require_once 'auth_helper.php';

$method = $_SERVER['REQUEST_METHOD'];

// Helper to auto-create and seed table
function ensureTableAndSeed($pdo) {
    try {
        $pdo->exec("CREATE TABLE IF NOT EXISTS interior_videos (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            video_path VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )");

        // Check if empty
        $stmt = $pdo->query("SELECT COUNT(*) FROM interior_videos");
        $count = $stmt->fetchColumn();

        if ($count == 0) {
            $stmt = $pdo->prepare("INSERT INTO interior_videos (title, video_path) VALUES (?, ?)");
            $stmt->execute(["Modern Living Space Walkthrough", "assets/video.mp4"]);
            $stmt->execute(["Minimalist Kitchen Concept", "assets/video.mp4"]);
            $stmt->execute(["Luxury Penthouse Suite Tour", "assets/video.mp4"]);
        }
    } catch (\PDOException $e) {
        // Log or handle error quietly
    }
}

if ($method === 'GET') {
    ensureTableAndSeed($pdo);
    try {
        $stmt = $pdo->query("SELECT * FROM interior_videos ORDER BY id DESC");
        $items = $stmt->fetchAll();
        echo json_encode($items);
    } catch (\PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Failed to fetch interior videos: " . $e->getMessage()]);
    }
} elseif ($method === 'POST') {
    // Check Auth
    checkAuthOrExit();
    ensureTableAndSeed($pdo);
    
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    
    $title = isset($data['title']) ? trim($data['title']) : '';
    $video_path = isset($data['video_path']) ? trim($data['video_path']) : '';

    if (empty($title) || empty($video_path)) {
        http_response_code(400);
        echo json_encode(["error" => "Title and Video Path are required."]);
        exit();
    }

    try {
        $stmt = $pdo->prepare("INSERT INTO interior_videos (title, video_path) VALUES (?, ?)");
        $stmt->execute([$title, $video_path]);
        echo json_encode(["success" => true, "message" => "Interior video added successfully!", "id" => $pdo->lastInsertId()]);
    } catch (\PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Database error: " . $e->getMessage()]);
    }
} elseif ($method === 'DELETE') {
    // Check Auth
    checkAuthOrExit();
    ensureTableAndSeed($pdo);
    
    $id = isset($_GET['id']) ? intval($_GET['id']) : 0;
    
    if ($id <= 0) {
        http_response_code(400);
        echo json_encode(["error" => "Invalid ID."]);
        exit();
    }
    
    try {
        $stmt = $pdo->prepare("DELETE FROM interior_videos WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(["success" => true, "message" => "Interior video deleted successfully!"]);
    } catch (\PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Database error: " . $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(["error" => "Method Not Allowed."]);
}
?>
