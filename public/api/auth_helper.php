<?php
// Shared Authentication Helper for signed base64 session tokens

function verifyToken($token) {
    $secret = 'supersecretjwtkey123!_infravision_itlc_project_2026';
    $parts = explode('.', $token);
    if (count($parts) !== 2) {
        return false;
    }
    
    $payload_encoded = $parts[0];
    $signature_encoded = $parts[1];
    
    $payload = base64_decode($payload_encoded);
    $signature = base64_decode($signature_encoded);
    
    $expected_signature = hash_hmac('sha256', $payload, $secret);
    
    if (!hash_equals($signature, $expected_signature)) {
        return false;
    }
    
    $data = json_decode($payload, true);
    if (!$data || !isset($data['exp']) || time() > $data['exp']) {
        return false;
    }
    
    return $data;
}

function checkAuthOrExit() {
    $authHeader = '';
    
    // Check $_SERVER first (Standard PHP behavior, keys are always uppercase)
    if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
        $authHeader = $_SERVER['HTTP_AUTHORIZATION'];
    } elseif (isset($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
        $authHeader = $_SERVER['REDIRECT_HTTP_AUTHORIZATION'];
    } else {
        // Fallback to case-insensitive headers lookup
        $headers = getallheaders();
        foreach ($headers as $key => $value) {
            if (strtolower($key) === 'authorization') {
                $authHeader = $value;
                break;
            }
        }
    }
    
    $token = '';
    if (preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
        $token = $matches[1];
    }
    
    if (empty($token) || !verifyToken($token)) {
        http_response_code(401);
        echo json_encode(["error" => "Unauthorized. Invalid or expired token."]);
        exit();
    }
    
    return true;
}

function getCurrentUserOrExit() {
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
    
    $token = '';
    if (preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
        $token = $matches[1];
    }
    
    if (empty($token)) {
        http_response_code(401);
        echo json_encode(["error" => "Unauthorized. Token missing."]);
        exit();
    }
    
    $decoded = verifyToken($token);
    if (!$decoded) {
        http_response_code(401);
        echo json_encode(["error" => "Unauthorized. Invalid or expired token."]);
        exit();
    }
    
    return $decoded;
}
?>
