<?php
require_once 'config.php';
require_once 'auth_helper.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    try {
        // 1. Fetch Tagline
        $stmt = $pdo->query("SELECT heading, subtext FROM cms_tagline WHERE id = 1");
        $tagline = $stmt->fetch();
        
        // 2. Fetch Features
        $stmt = $pdo->query("SELECT icon, title, description FROM cms_features ORDER BY id ASC");
        $features = $stmt->fetchAll();
        
        // 3. Fetch About Details
        $stmt = $pdo->query("SELECT title, text1, text2, experience, projects, awards FROM cms_about WHERE id = 1");
        $about = $stmt->fetch();
        
        echo json_encode([
            "tagline" => $tagline,
            "features" => $features,
            "about" => $about
        ]);
    } catch (\PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Failed to fetch CMS data: " . $e->getMessage()]);
    }
} elseif ($method === 'POST') {
    // Check Auth
    checkAuthOrExit();
    
    // Parse the input data
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    
    $tagline = isset($data['tagline']) ? $data['tagline'] : null;
    $features = isset($data['features']) ? $data['features'] : null;
    $about = isset($data['about']) ? $data['about'] : null;
    
    try {
        $pdo->beginTransaction();
        
        // 1. Update Tagline
        if ($tagline) {
            $stmt = $pdo->prepare("UPDATE cms_tagline SET heading = ?, subtext = ? WHERE id = 1");
            $stmt->execute([$tagline['heading'], $tagline['subtext']]);
        }
        
        // 2. Update Features
        if ($features && is_array($features)) {
            foreach ($features as $index => $feature) {
                $id = $index + 1; // features have seed IDs 1, 2, 3
                $stmt = $pdo->prepare("UPDATE cms_features SET icon = ?, title = ?, description = ? WHERE id = ?");
                $stmt->execute([$feature['icon'], $feature['title'], $feature['description'], $id]);
            }
        }
        
        // 3. Update About
        if ($about) {
            $stmt = $pdo->prepare("UPDATE cms_about SET title = ?, text1 = ?, text2 = ?, experience = ?, projects = ?, awards = ? WHERE id = 1");
            $stmt->execute([
                $about['title'],
                $about['text1'],
                $about['text2'],
                intval($about['experience']),
                intval($about['projects']),
                intval($about['awards'])
            ]);
        }
        
        $pdo->commit();
        echo json_encode(["success" => true, "message" => "CMS configurations updated successfully!"]);
    } catch (\PDOException $e) {
        $pdo->rollBack();
        http_response_code(500);
        echo json_encode(["error" => "Failed to update CMS data: " . $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(["error" => "Method Not Allowed. Use GET or POST."]);
}
?>
