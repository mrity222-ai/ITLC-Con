<?php
require_once 'config.php';
require_once 'auth_helper.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    try {
        $stmt = $pdo->query("SELECT * FROM services ORDER BY id ASC");
        $services = $stmt->fetchAll();
        
        // Map dynamic details to object to align with React details views
        foreach ($services as &$service) {
            $service['details'] = [
                "timeline" => $service['timeline'],
                "materials" => $service['materials'],
                "rating" => $service['rating'],
                "solar" => $service['solar'],
                "costIndex" => $service['costIndex']
            ];
        }
        
        echo json_encode($services);
    } catch (\PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Failed to fetch services: " . $e->getMessage()]);
    }
} elseif ($method === 'POST') {
    checkAuthOrExit();
    
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    
    $id = isset($data['id']) ? intval($data['id']) : 0;
    $title = isset($data['title']) ? trim($data['title']) : '';
    $description = isset($data['description']) ? trim($data['description']) : '';
    $icon = isset($data['icon']) ? trim($data['icon']) : 'fa-house-chimney';
    $image = isset($data['image']) ? trim($data['image']) : 'assets/images/service_residential.jpg';
    $timeline = isset($data['timeline']) ? trim($data['timeline']) : '';
    
    $materials = isset($data['materials']) ? trim($data['materials']) : '';
    $rating = isset($data['rating']) ? trim($data['rating']) : '';
    $solar = isset($data['solar']) ? trim($data['solar']) : '';
    $costIndex = isset($data['costIndex']) ? trim($data['costIndex']) : '';

    if (empty($title) || empty($description)) {
        http_response_code(400);
        echo json_encode(["error" => "Title and Description are required."]);
        exit();
    }

    try {
        if ($id > 0) {
            $stmt = $pdo->prepare("UPDATE services SET title = ?, description = ?, icon = ?, image = ?, timeline = ?, materials = ?, rating = ?, solar = ?, costIndex = ? WHERE id = ?");
            $stmt->execute([$title, $description, $icon, $image, $timeline, $materials, $rating, $solar, $costIndex, $id]);
            echo json_encode(["success" => true, "message" => "Service updated successfully!"]);
        } else {
            $stmt = $pdo->prepare("INSERT INTO services (title, description, icon, image, timeline, materials, rating, solar, costIndex) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([$title, $description, $icon, $image, $timeline, $materials, $rating, $solar, $costIndex]);
            echo json_encode(["success" => true, "message" => "Service added successfully!"]);
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
        echo json_encode(["error" => "Invalid Service ID."]);
        exit();
    }
    
    try {
        $stmt = $pdo->prepare("DELETE FROM services WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(["success" => true, "message" => "Service deleted successfully!"]);
    } catch (\PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Database error: " . $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(["error" => "Method Not Allowed."]);
}
?>
