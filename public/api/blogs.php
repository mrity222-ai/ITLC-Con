<?php
require_once 'config.php';
require_once 'auth_helper.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $isAdmin = false;
    
    // Check if valid token is provided to view drafts
    $authHeader = '';
    if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
        $authHeader = $_SERVER['HTTP_AUTHORIZATION'];
    } elseif (isset($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
        $authHeader = $_SERVER['REDIRECT_HTTP_AUTHORIZATION'];
    } else {
        $headers = getallheaders();
        foreach ($headers as $key => $value) {
            if (strtolower($key) === 'authorization') {
                $authHeader = $value;
                break;
            }
        }
    }
    
    if (!empty($authHeader) && preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
        $token = $matches[1];
        if (verifyToken($token)) {
            $isAdmin = true;
        }
    }

    // Specific blog by slug parameter
    $slug = isset($_GET['slug']) ? trim($_GET['slug']) : '';

    try {
        if (!empty($slug)) {
            if ($isAdmin) {
                $stmt = $pdo->prepare("SELECT * FROM blogs WHERE slug = ?");
            } else {
                $stmt = $pdo->prepare("SELECT * FROM blogs WHERE slug = ? AND status = 'published'");
            }
            $stmt->execute([$slug]);
            $blog = $stmt->fetch();
            if ($blog) {
                $blog['category'] = 'News';
                $blog['excerpt'] = substr(strip_tags($blog['content']), 0, 150) . (strlen($blog['content']) > 150 ? '...' : '');
                echo json_encode($blog);
            } else {
                http_response_code(404);
                echo json_encode(["error" => "Blog post not found."]);
            }
        } else {
            if ($isAdmin) {
                $stmt = $pdo->query("SELECT * FROM blogs ORDER BY published_date DESC, id DESC");
            } else {
                $stmt = $pdo->query("SELECT * FROM blogs WHERE status = 'published' ORDER BY published_date DESC, id DESC");
            }
            $blogs = $stmt->fetchAll();
            
            foreach ($blogs as &$blog) {
                $blog['category'] = 'News';
                $blog['excerpt'] = substr(strip_tags($blog['content']), 0, 150) . (strlen($blog['content']) > 150 ? '...' : '');
            }
            echo json_encode($blogs);
        }
    } catch (\PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Failed to fetch blogs: " . $e->getMessage()]);
    }
} elseif ($method === 'POST') {
    checkAuthOrExit();
    
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    
    $id = isset($data['id']) ? intval($data['id']) : 0;
    $title = isset($data['title']) ? trim($data['title']) : '';
    $slug = isset($data['slug']) ? trim($data['slug']) : '';
    $content = isset($data['content']) ? trim($data['content']) : '';
    $featured_image = isset($data['featured_image']) ? trim($data['featured_image']) : 'assets/images/project6.jpg';
    $author = isset($data['author']) ? trim($data['author']) : '';
    $published_date = isset($data['published_date']) ? trim($data['published_date']) : date('Y-m-d');
    $status = isset($data['status']) ? trim($data['status']) : 'published';

    if (empty($title) || empty($content)) {
        http_response_code(400);
        echo json_encode(["error" => "Title and Content are required."]);
        exit();
    }

    // Auto-generate slug if empty
    if (empty($slug)) {
        $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $title)));
    }

    try {
        if ($id > 0) {
            $stmt = $pdo->prepare("UPDATE blogs SET title = ?, slug = ?, content = ?, featured_image = ?, author = ?, published_date = ?, status = ? WHERE id = ?");
            $stmt->execute([$title, $slug, $content, $featured_image, $author, $published_date, $status, $id]);
            echo json_encode(["success" => true, "message" => "Blog post updated successfully!", "slug" => $slug]);
        } else {
            // Check unique slug
            $check = $pdo->prepare("SELECT id FROM blogs WHERE slug = ?");
            $check->execute([$slug]);
            if ($check->fetch()) {
                // append timestamp to make it unique
                $slug .= '-' . time();
            }

            $stmt = $pdo->prepare("INSERT INTO blogs (title, slug, content, featured_image, author, published_date, status) VALUES (?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([$title, $slug, $content, $featured_image, $author, $published_date, $status]);
            echo json_encode(["success" => true, "message" => "Blog post added successfully!", "slug" => $slug]);
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
        echo json_encode(["error" => "Invalid Blog post ID."]);
        exit();
    }
    
    try {
        $stmt = $pdo->prepare("DELETE FROM blogs WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(["success" => true, "message" => "Blog post deleted successfully!"]);
    } catch (\PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Database error: " . $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(["error" => "Method Not Allowed."]);
}
?>
