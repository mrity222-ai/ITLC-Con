<?php
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["error" => "Method Not Allowed. Use POST."]);
    exit();
}

$input = file_get_contents('php://input');
$data = json_decode($input, true);

$name = isset($data['name']) ? trim($data['name']) : '';
$email = isset($data['email']) ? trim($data['email']) : '';
$service = isset($data['service']) ? trim($data['service']) : 'residential';
$message = isset($data['message']) ? trim($data['message']) : '';

// Validation
$errors = [];
if (empty($name)) {
    $errors['name'] = "Name is required.";
}
if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors['email'] = "A valid email address is required.";
}
if (empty($message) || strlen($message) < 15) {
    $errors['message'] = "Project description must be at least 15 characters.";
}

if (!empty($errors)) {
    http_response_code(400);
    echo json_encode(["errors" => $errors]);
    exit();
}

try {
    $stmt = $pdo->prepare("INSERT INTO contact_proposals (name, email, service, message) VALUES (?, ?, ?, ?)");
    $stmt->execute([$name, $email, $service, $message]);
    
    echo json_encode([
        "success" => true,
        "message" => "Proposal submitted successfully!"
    ]);
} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Database error: " . $e->getMessage()]);
}
?>
