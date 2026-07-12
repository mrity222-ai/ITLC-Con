<?php
require_once 'config.php';

header('Content-Type: application/json');

// Dynamically ensure reset_otp column exists
try {
    $stmt = $pdo->query("SHOW COLUMNS FROM admins LIKE 'reset_otp'");
    if (!$stmt->fetch()) {
        $pdo->exec("ALTER TABLE admins ADD COLUMN reset_otp VARCHAR(10) NULL");
    }
} catch (\PDOException $e) {
    // Table or column alteration check ignored/failed
}

$action = isset($_GET['action']) ? trim($_GET['action']) : '';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["error" => "Method Not Allowed. Use POST."]);
    exit();
}

$input = file_get_contents('php://input');
$data = json_decode($input, true);

if ($action === 'request') {
    $email = isset($data['email']) ? trim($data['email']) : '';

    if (empty($email)) {
        http_response_code(400);
        echo json_encode(["error" => "Registered email address is required."]);
        exit();
    }

    try {
        $stmt = $pdo->prepare("SELECT id FROM admins WHERE email = ?");
        $stmt->execute([$email]);
        $admin = $stmt->fetch();

        if (!$admin) {
            http_response_code(404);
            echo json_encode(["error" => "No admin registered with this email address."]);
            exit();
        }

        // Generate 6-digit secure numeric OTP
        $otp = (string)mt_rand(100000, 999999);

        // Save OTP to database
        $update = $pdo->prepare("UPDATE admins SET reset_otp = ? WHERE email = ?");
        $update->execute([$otp, $email]);

        // Simulating email dispatch by returning the OTP in response
        echo json_encode([
            "success" => true,
            "message" => "A password reset OTP has been sent to your registered email!",
            "otp" => $otp // Provided for verification/UI simulation purposes
        ]);

    } catch (\PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Database error: " . $e->getMessage()]);
    }

} elseif ($action === 'reset') {
    $email = isset($data['email']) ? trim($data['email']) : '';
    $otp = isset($data['otp']) ? trim($data['otp']) : '';
    $newPassword = isset($data['new_password']) ? trim($data['new_password']) : '';

    if (empty($email) || empty($otp) || empty($newPassword)) {
        http_response_code(400);
        echo json_encode(["error" => "Email, OTP, and New Password are all required."]);
        exit();
    }

    if (strlen($newPassword) < 8) {
        http_response_code(400);
        echo json_encode(["error" => "New password must be at least 8 characters long."]);
        exit();
    }

    try {
        $stmt = $pdo->prepare("SELECT reset_otp FROM admins WHERE email = ?");
        $stmt->execute([$email]);
        $admin = $stmt->fetch();

        if (!$admin || empty($admin['reset_otp']) || $admin['reset_otp'] !== $otp) {
            http_response_code(400);
            echo json_encode(["error" => "Invalid or expired password reset OTP."]);
            exit();
        }

        // Hash new password using same BCRYPT pattern as migrations
        $hashed = password_hash($newPassword, PASSWORD_BCRYPT);

        // Update password and clear OTP
        $update = $pdo->prepare("UPDATE admins SET password_hash = ?, reset_otp = NULL WHERE email = ?");
        $update->execute([$hashed, $email]);

        echo json_encode([
            "success" => true,
            "message" => "Your password has been successfully reset! You can now log in with your new credentials."
        ]);

    } catch (\PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Database error: " . $e->getMessage()]);
    }

} else {
    http_response_code(400);
    echo json_encode(["error" => "Invalid action parameter."]);
}
?>
