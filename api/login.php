<?php
require_once 'config.php';

// Get the raw POST data
$input = file_get_contents('php://input');
$data = json_decode($input, true);

$username = isset($data['username']) ? trim($data['username']) : '';
$password = isset($data['password']) ? trim($data['password']) : '';

if (empty($username) || empty($password)) {
    http_response_code(400);
    echo json_encode(["error" => "Username and password are required."]);
    exit();
}

try {
    $stmt = $pdo->prepare("SELECT * FROM admins WHERE email = ?");
    $stmt->execute([$username]);
    $user = $stmt->fetch();

    // Verify password using password_verify
    if ($user && password_verify($password, $user['password_hash'])) {
        // Log success
        try {
            $logStmt = $pdo->prepare("INSERT INTO audit_logs (username_attempted, status, ip_address) VALUES (?, ?, ?)");
            $logStmt->execute([$username, 'success', $_SERVER['REMOTE_ADDR'] ?? 'unknown']);
        } catch (\PDOException $le) {
            // ignore logging error
        }

        // Generate a custom signed token (similar to JWT)
        $secret = 'supersecretjwtkey123!_infravision_itlc_project_2026';
        $payload = json_encode([
            "email" => $user['email'],
            "name" => $user['name'],
            "role" => $user['role'],
            "exp" => time() + 86400 // Token valid for 24 hours
        ]);
        
        $payload_encoded = base64_encode($payload);
        $signature = hash_hmac('sha256', $payload, $secret);
        $signature_encoded = base64_encode($signature);
        
        $token = $payload_encoded . '.' . $signature_encoded;

        echo json_encode([
            "success" => true,
            "message" => "Login successful",
            "token" => $token
        ]);
    } else {
        // Log failure
        try {
            $logStmt = $pdo->prepare("INSERT INTO audit_logs (username_attempted, status, ip_address) VALUES (?, ?, ?)");
            $logStmt->execute([$username, 'failed', $_SERVER['REMOTE_ADDR'] ?? 'unknown']);
        } catch (\PDOException $le) {
            // ignore logging error
        }

        http_response_code(401);
        echo json_encode(["error" => "Invalid username or password."]);
    }
} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Database error: " . $e->getMessage()]);
}
?>
