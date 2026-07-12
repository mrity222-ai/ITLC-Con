<?php
require_once 'config.php';
require_once 'auth_helper.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    try {
        $stmt = $pdo->query("SELECT * FROM projects ORDER BY id DESC");
        $projects = $stmt->fetchAll();
        
        // Add specs object mapping to match React frontend structure
        foreach ($projects as &$project) {
            $project['specs'] = [
                "area" => $project['area'],
                "concrete" => $project['concrete'],
                "framing" => $project['framing'],
                "leed" => $project['leed']
            ];
        }
        
        echo json_encode($projects);
    } catch (\PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Failed to fetch projects: " . $e->getMessage()]);
    }
} elseif ($method === 'POST') {
    // Check Auth
    checkAuthOrExit();
    
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    
    $id = isset($data['id']) ? intval($data['id']) : 0;
    $title = isset($data['title']) ? trim($data['title']) : '';
    $description = isset($data['description']) ? trim($data['description']) : '';
    $image = isset($data['image']) ? trim($data['image']) : 'assets/images/project1.jpg'; // default
    $category = isset($data['category']) ? trim($data['category']) : 'Residential';
    $location = isset($data['location']) ? trim($data['location']) : '';
    $year = isset($data['year']) ? trim($data['year']) : '';
    $client = isset($data['client']) ? trim($data['client']) : '';
    
    $area = isset($data['area']) ? trim($data['area']) : '';
    $concrete = isset($data['concrete']) ? trim($data['concrete']) : '';
    $framing = isset($data['framing']) ? trim($data['framing']) : '';
    $leed = isset($data['leed']) ? trim($data['leed']) : '';

    if (empty($title) || empty($description) || empty($location)) {
        http_response_code(400);
        echo json_encode(["error" => "Title, Description, and Location are required."]);
        exit();
    }

    try {
        if ($id > 0) {
            // Update
            $stmt = $pdo->prepare("UPDATE projects SET title = ?, description = ?, image = ?, category = ?, location = ?, year = ?, client = ?, area = ?, concrete = ?, framing = ?, leed = ? WHERE id = ?");
            $stmt->execute([$title, $description, $image, $category, $location, $year, $client, $area, $concrete, $framing, $leed, $id]);
            echo json_encode(["success" => true, "message" => "Project updated successfully!"]);
        } else {
            // Insert
            $stmt = $pdo->prepare("INSERT INTO projects (title, description, image, category, location, year, client, area, concrete, framing, leed) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([$title, $description, $image, $category, $location, $year, $client, $area, $concrete, $framing, $leed]);
            echo json_encode(["success" => true, "message" => "Project added successfully!"]);
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
        echo json_encode(["error" => "Invalid Project ID."]);
        exit();
    }
    
    try {
        $stmt = $pdo->prepare("DELETE FROM projects WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(["success" => true, "message" => "Project deleted successfully!"]);
    } catch (\PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Database error: " . $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(["error" => "Method Not Allowed."]);
}
?>
