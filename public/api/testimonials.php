<?php
require_once 'config.php';
require_once 'auth_helper.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    try {
        $stmt = $pdo->query("SELECT * FROM testimonials ORDER BY id DESC");
        $testimonials = $stmt->fetchAll();
        
        // Map fields to alias names to keep compatibility with existing scrolling view
        foreach ($testimonials as &$t) {
            $t['name'] = $t['client_name'];
            $t['avatar'] = !empty($t['client_image']) ? $t['client_image'] : "https://i.pravatar.cc/60?img=" . (10 + intval($t['id']));
            $t['text'] = $t['testimonial_text'];
            $t['stars'] = intval($t['rating']);
        }
        
        echo json_encode($testimonials);
    } catch (\PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Failed to fetch testimonials: " . $e->getMessage()]);
    }
} elseif ($method === 'POST') {
    checkAuthOrExit();
    
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    
    $id = isset($data['id']) ? intval($data['id']) : 0;
    $client_name = isset($data['client_name']) ? trim($data['client_name']) : '';
    $client_designation = isset($data['client_designation']) ? trim($data['client_designation']) : '';
    $testimonial_text = isset($data['testimonial_text']) ? trim($data['testimonial_text']) : '';
    $rating = isset($data['rating']) ? intval($data['rating']) : 5;
    $client_image = isset($data['client_image']) ? trim($data['client_image']) : '';

    if (empty($client_name) || empty($testimonial_text)) {
        http_response_code(400);
        echo json_encode(["error" => "Client name and Testimonial text are required."]);
        exit();
    }

    try {
        if ($id > 0) {
            $stmt = $pdo->prepare("UPDATE testimonials SET client_name = ?, client_designation = ?, testimonial_text = ?, rating = ?, client_image = ? WHERE id = ?");
            $stmt->execute([$client_name, $client_designation, $testimonial_text, $rating, $client_image, $id]);
            echo json_encode(["success" => true, "message" => "Testimonial updated successfully!"]);
        } else {
            $stmt = $pdo->prepare("INSERT INTO testimonials (client_name, client_designation, testimonial_text, rating, client_image) VALUES (?, ?, ?, ?, ?)");
            $stmt->execute([$client_name, $client_designation, $testimonial_text, $rating, $client_image]);
            echo json_encode(["success" => true, "message" => "Testimonial added successfully!"]);
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
        echo json_encode(["error" => "Invalid Testimonial ID."]);
        exit();
    }
    
    try {
        $stmt = $pdo->prepare("DELETE FROM testimonials WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(["success" => true, "message" => "Testimonial deleted successfully!"]);
    } catch (\PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Database error: " . $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(["error" => "Method Not Allowed."]);
}
?>
