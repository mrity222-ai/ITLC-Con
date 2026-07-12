<?php
require_once 'config.php';
require_once 'auth_helper.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    try {
        $stmt = $pdo->query("SELECT * FROM partners ORDER BY id ASC");
        $partners = $stmt->fetchAll();
        echo json_encode($partners);
    } catch (\PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Failed to fetch partners: " . $e->getMessage()]);
    }
} elseif ($method === 'POST') {
    checkAuthOrExit();
    
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    
    $id = isset($data['id']) ? intval($data['id']) : 0;
    $name = isset($data['name']) ? trim($data['name']) : '';
    $image = isset($data['image']) ? trim($data['image']) : '';

    if (empty($name) || empty($image)) {
        http_response_code(400);
        echo json_encode(["error" => "Partner name and image/logo path are required."]);
        exit();
    }

    try {
        if ($id > 0) {
            $stmt = $pdo->prepare("UPDATE partners SET name = ?, image = ? WHERE id = ?");
            $stmt->execute([$name, $image, $id]);
            echo json_encode(["success" => true, "message" => "Partner updated successfully!"]);
        } else {
            $stmt = $pdo->prepare("INSERT INTO partners (name, image) VALUES (?, ?)");
            $stmt->execute([$name, $image]);
            echo json_encode(["success" => true, "message" => "Partner added successfully!"]);
        }
    } catch (\PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Database error: " . $e->getMessage()]);
    }
} elseif ($method === 'DELETE') {
    checkAuthOrExit();
    
    $id = isset($_GET['id']) ? intval($_GET['id']) : 0;
    
    if ($id <= 0) {
        http_response_code(400);
        echo json_encode(["error" => "Invalid Partner ID."]);
        exit();
    }
    
    try {
        $stmt = $pdo->prepare("DELETE FROM partners WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(["success" => true, "message" => "Partner deleted successfully!"]);
    } catch (\PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Database error: " . $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(["error" => "Method Not Allowed."]);
}
?>
