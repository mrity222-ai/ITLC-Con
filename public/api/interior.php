<?php
require_once 'config.php';
require_once 'auth_helper.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    try {
        $stmt = $pdo->query("SELECT * FROM interior ORDER BY id DESC");
        $items = $stmt->fetchAll();
        echo json_encode($items);
    } catch (\PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Failed to fetch interior items: " . $e->getMessage()]);
    }
} elseif ($method === 'POST') {
    // Check Auth
    checkAuthOrExit();
    
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    
    $id = isset($data['id']) ? intval($data['id']) : 0;
    $title = isset($data['title']) ? trim($data['title']) : '';
    $description = isset($data['description']) ? trim($data['description']) : '';
    $image = isset($data['image']) ? trim($data['image']) : 'assets/images/interior_living.jpg'; // default
    $category = isset($data['category']) ? trim($data['category']) : 'Residential';
    $style = isset($data['style']) ? trim($data['style']) : '';
    $materials = isset($data['materials']) ? trim($data['materials']) : '';
    $year = isset($data['year']) ? trim($data['year']) : '';

    if (empty($title) || empty($description) || empty($category)) {
        http_response_code(400);
        echo json_encode(["error" => "Title, Description, and Category are required."]);
        exit();
    }

    try {
        if ($id > 0) {
            // Update
            $stmt = $pdo->prepare("UPDATE interior SET title = ?, description = ?, image = ?, category = ?, style = ?, materials = ?, year = ? WHERE id = ?");
            $stmt->execute([$title, $description, $image, $category, $style, $materials, $year, $id]);
            echo json_encode(["success" => true, "message" => "Interior item updated successfully!"]);
        } else {
            // Insert
            $stmt = $pdo->prepare("INSERT INTO interior (title, description, image, category, style, materials, year) VALUES (?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([$title, $description, $image, $category, $style, $materials, $year]);
            echo json_encode(["success" => true, "message" => "Interior item added successfully!"]);
        }
    } catch (\PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Database error: " . $e->getMessage()]);
    }
} elseif ($method === 'DELETE') {
    // Check Auth
    checkAuthOrExit();
    
    $id = isset($_GET['id']) ? intval($_GET['id']) : 0;
    
    if ($id <= 0) {
        http_response_code(400);
        echo json_encode(["error" => "Invalid ID."]);
        exit();
    }
    
    try {
        $stmt = $pdo->prepare("DELETE FROM interior WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(["success" => true, "message" => "Interior item deleted successfully!"]);
    } catch (\PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Database error: " . $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(["error" => "Method Not Allowed."]);
}
?>
