<?php
require_once 'config.php';
require_once 'auth_helper.php';

$method = $_SERVER['REQUEST_METHOD'];

// Verify token and retrieve user info
$currentUser = getCurrentUserOrExit();
$currentUserEmail = $currentUser['email'] ?? '';
$currentUserRole = $currentUser['role'] ?? '';

if ($method === 'POST' && isset($_GET['action']) && $_GET['action'] === 'change_password') {
    // 1. Change Password
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    
    $currentPassword = isset($data['current_password']) ? $data['current_password'] : '';
    $newPassword = isset($data['new_password']) ? $data['new_password'] : '';
    $confirmPassword = isset($data['confirm_password']) ? $data['confirm_password'] : '';
    
    if (empty($currentPassword) || empty($newPassword) || empty($confirmPassword)) {
        http_response_code(400);
        echo json_encode(["error" => "All password fields are required."]);
        exit();
    }
    
    if ($newPassword !== $confirmPassword) {
        http_response_code(400);
        echo json_encode(["error" => "New password and confirmation do not match."]);
        exit();
    }
    
    if (strlen($newPassword) < 8) {
        http_response_code(400);
        echo json_encode(["error" => "New password must be at least 8 characters long."]);
        exit();
    }
    
    try {
        $stmt = $pdo->prepare("SELECT * FROM admins WHERE email = ?");
        $stmt->execute([$currentUserEmail]);
        $dbUser = $stmt->fetch();
        
        if (!$dbUser || !password_verify($currentPassword, $dbUser['password_hash'])) {
            http_response_code(401);
            echo json_encode(["error" => "Current password is incorrect."]);
            exit();
        }
        
        $newHash = password_hash($newPassword, PASSWORD_BCRYPT);
        $updateStmt = $pdo->prepare("UPDATE admins SET password_hash = ? WHERE email = ?");
        $updateStmt->execute([$newHash, $currentUserEmail]);
        
        echo json_encode(["success" => true, "message" => "Password updated successfully!"]);
    } catch (\PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Database error: " . $e->getMessage()]);
    }
    exit();
}

// Enforce Role-Based Access Control (RBAC) - ONLY Super Admin can manage sub-admin accounts
if ($currentUserRole !== 'Super Admin') {
    http_response_code(403);
    echo json_encode(["error" => "Access denied. Only Super Admin can manage admin accounts."]);
    exit();
}

if ($method === 'GET') {
    // Fetch all admins
    try {
        $stmt = $pdo->query("SELECT id, name, email, role, created_at FROM admins ORDER BY id ASC");
        $admins = $stmt->fetchAll();
        echo json_encode($admins);
    } catch (\PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Failed to fetch admin accounts: " . $e->getMessage()]);
    }
} elseif ($method === 'POST') {
    // Add/Edit Sub-Admin
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    
    $id = isset($data['id']) ? intval($data['id']) : 0;
    $name = isset($data['name']) ? trim($data['name']) : '';
    $email = isset($data['email']) ? trim($data['email']) : '';
    $password = isset($data['password']) ? trim($data['password']) : '';
    $role = isset($data['role']) ? trim($data['role']) : 'Viewer';
    
    if (empty($name) || empty($email) || ($id === 0 && empty($password))) {
        http_response_code(400);
        echo json_encode(["error" => "Name, Email/Username, and Password are required."]);
        exit();
    }
    
    // Validate role
    $allowedRoles = ['Super Admin', 'Editor', 'Viewer'];
    if (!in_array($role, $allowedRoles)) {
        http_response_code(400);
        echo json_encode(["error" => "Invalid role selected."]);
        exit();
    }
    
    try {
        if ($id > 0) {
            // Edit Admin
            // Don't change password if empty
            if (!empty($password)) {
                if (strlen($password) < 8) {
                    http_response_code(400);
                    echo json_encode(["error" => "Password must be at least 8 characters long."]);
                    exit();
                }
                $hash = password_hash($password, PASSWORD_BCRYPT);
                $stmt = $pdo->prepare("UPDATE admins SET name = ?, email = ?, password_hash = ?, role = ? WHERE id = ?");
                $stmt->execute([$name, $email, $hash, $role, $id]);
            } else {
                $stmt = $pdo->prepare("UPDATE admins SET name = ?, email = ?, role = ? WHERE id = ?");
                $stmt->execute([$name, $email, $role, $id]);
            }
            echo json_encode(["success" => true, "message" => "Admin account updated successfully!"]);
        } else {
            // Add Admin
            // Check if email already exists
            $checkStmt = $pdo->prepare("SELECT COUNT(*) FROM admins WHERE email = ?");
            $checkStmt->execute([$email]);
            if ($checkStmt->fetchColumn() > 0) {
                http_response_code(400);
                echo json_encode(["error" => "Admin account with this username/email already exists."]);
                exit();
            }
            
            if (strlen($password) < 8) {
                http_response_code(400);
                echo json_encode(["error" => "Password must be at least 8 characters long."]);
                exit();
            }
            
            $hash = password_hash($password, PASSWORD_BCRYPT);
            $stmt = $pdo->prepare("INSERT INTO admins (name, email, password_hash, role) VALUES (?, ?, ?, ?)");
            $stmt->execute([$name, $email, $hash, $role]);
            echo json_encode(["success" => true, "message" => "Admin account created successfully!"]);
        }
    } catch (\PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Database error: " . $e->getMessage()]);
    }
} elseif ($method === 'DELETE') {
    // Delete Sub-Admin
    $id = isset($_GET['id']) ? intval($_GET['id']) : 0;
    
    if ($id <= 0) {
        http_response_code(400);
        echo json_encode(["error" => "Invalid ID."]);
        exit();
    }
    
    try {
        // Prevent deleting the currently logged-in admin
        $stmt = $pdo->prepare("SELECT email FROM admins WHERE id = ?");
        $stmt->execute([$id]);
        $targetEmail = $stmt->fetchColumn();
        
        if ($targetEmail === $currentUserEmail) {
            http_response_code(400);
            echo json_encode(["error" => "You cannot delete your own logged-in account."]);
            exit();
        }
        
        $delStmt = $pdo->prepare("DELETE FROM admins WHERE id = ?");
        $delStmt->execute([$id]);
        echo json_encode(["success" => true, "message" => "Admin account deleted successfully!"]);
    } catch (\PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Database error: " . $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(["error" => "Method Not Allowed."]);
}
?>
