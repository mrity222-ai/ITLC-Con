<?php
// CORS Headers to allow requests from frontend
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, DELETE, PUT");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Auto-detect environment (local vs production Hostinger)
$is_local = (strpos(__DIR__, 'd:\\') === 0 || strpos(__DIR__, 'D:\\') === 0 || in_array($_SERVER['HTTP_HOST'] ?? '', ['localhost', '127.0.0.1', '[::1]']));

if ($is_local) {
    // Local Database Credentials (XAMPP)
    $host = 'localhost';
    $db   = 'u997632379_Infravision';
    $user = 'root';
    $pass = '';
} else {
    // Production Database Credentials (Hostinger)
    $host = 'localhost';
    $db   = 'u997632379_infravision';
    $user = 'u997632379_infra';
    $pass = 'Itlc@121';
}
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Database connection failed: " . $e->getMessage()]);
    exit();
}
?>
