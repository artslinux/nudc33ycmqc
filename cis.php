<?php
defined('BASEPATH') OR exit('No direct script access allowed');

// 1. Force HTTPS and Implement HSTS
if (!isset($_SERVER['HTTPS']) || $_SERVER['HTTPS'] !== 'on') {
    if (!isset($_SERVER['HTTP_X_FORWARDED_PROTO']) || $_SERVER['HTTP_X_FORWARDED_PROTO'] !== 'https') {
        header("Location: https://" . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI']);
        exit();
    }
}
header("Strict-Transport-Security: max-age=31536000; includeSubDomains; preload");

// 2. Content Security Policy (CSP)
header("Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self'; frame-ancestors 'none';");

// 3. Data Signature Generation and Validation
function generate_signature($data, $secret) {
    return hash_hmac('sha256', $data, $secret);
}

if ($_POST) {
    $received_data = $_POST['data'] ?? '';
    $received_signature = $_POST['signature'] ?? '';
    $secret = 'your_secret_key';

    if (!hash_equals(generate_signature($received_data, $secret), $received_signature)) {
        die('Data integrity check failed. Possible MitM attack detected.');
    }
}

// 4. SameSite Cookie Attribute
setcookie('session', 'session_value', [
    'expires' => time() + 86400,
    'path' => '/',
    'domain' => 'yourdomain.com',
    'secure' => true,
    'httponly' => true,
    'samesite' => 'Strict',
]);

// 5. Scan Files and Detect Backdoors
function scan_files($dir, &$results = array()) {
    $files = scandir($dir);
    foreach ($files as $value) {
        $path = realpath($dir . DIRECTORY_SEPARATOR . $value);
        if (!is_dir($path)) {
            $results[] = $path;
        } else if ($value != "." && $value != "..") {
            scan_files($path, $results);
            $results[] = $path;
        }
    }
    return $results;
}

function check_for_backdoor($file) {
    $suspicious_patterns = array(
        '/eval\(/', '/base64_decode\(/', '/exec\(/', 
        '/system\(/', '/shell_exec\(/', '/passthru\(/', 
        '/gzinflate\(/', '/str_rot13\(/', '/strrev\(/', 
        '/gzuncompress\(/'
    );

    $content = file_get_contents($file);
    foreach ($suspicious_patterns as $pattern) {
        if (preg_match($pattern, $content)) {
            echo "Potential backdoor detected in: $file\n";
        }
    }
}

// 6. Validate File Inclusions
function validate_file_inclusion($file) {
    $allowed_directories = array(
        realpath('/path/to/your/codeigniter/application/views/'), 
        realpath('/path/to/your/codeigniter/application/controllers/')
    );
    $real_file_path = realpath($file);

    foreach ($allowed_directories as $dir) {
        if (strpos($real_file_path, $dir) === 0) {
            return true;
        }
    }
    return false;
}

// 7. Validate Uploads
function validate_upload($file) {
    $allowed_extensions = array('jpg', 'jpeg', 'png', 'gif', 'pdf');
    $extension = pathinfo($file['name'], PATHINFO_EXTENSION);

    if (!in_array(strtolower($extension), $allowed_extensions)) {
        return false;
    }

    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mime_type = finfo_file($finfo, $file['tmp_name']);
    finfo_close($finfo);
    if (strpos($mime_type, 'image/') !== 0 && $mime_type !== 'application/pdf') {
        return false;
    }

    if ($file['size'] > 2000000) { // Maksimal 2MB
        return false;
    }

    return true;
}

// 8. Log File Activity
function log_file_activity($action, $file) {
    $log_file = '/path/to/your/logs/file_activity.log';
    $entry = date('Y-m-d H:i:s') . " - $action: $file\n";
    file_put_contents($log_file, $entry, FILE_APPEND);
}

// 9. Authenticate API Requests
function authenticate_api_request() {
    $authorized_keys = array('your_api_key_here');
    $provided_key = $_SERVER['HTTP_AUTHORIZATION'] ?? '';

    if (!in_array($provided_key, $authorized_keys)) {
        http_response_code(401);
        die('Unauthorized API access detected.');
    }
}

// 10. Enforce Security Enhancements
$config['csrf_protection'] = TRUE;
$config['global_xss_filtering'] = TRUE;

// 11. XSS and Input Validation
$this->load->library('form_validation');
$this->form_validation->set_rules('input_field', 'Input Field', 'required');
if ($this->form_validation->run() == FALSE) {
    die('Input validation failed.');
}

if ($this->input->post()) {
    $clean_input = $this->security->xss_clean($this->input->post('input_field', TRUE));
}

// 12. Restrict Access to Controllers
if (!$this->session->userdata('logged_in')) {
    redirect('login');
}

// 13. Monitor SQL Injection Attempts
function monitor_sql_injection($input) {
    $patterns = array(
        '/(\bUNION\b|\bSELECT\b|\bINSERT\b|\bUPDATE\b|\bDELETE\b|\bDROP\b|\bALTER\b|\bCREATE\b)/i',
        '/(\bOR\b|\bAND\b|\bWHERE\b|\bLIKE\b|\bFROM\b|\bINTO\b|\bVALUES\b|\bSET\b)/i'
    );

    foreach ($patterns as $pattern) {
        if (preg_match($pattern, $input)) {
            http_response_code(403);
            die('SQL Injection attempt detected.');
        }
    }
}

// Monitor SQL Injection attempts on both $_POST and $_SERVER data
if ($_POST) {
    foreach ($_POST as $input) {
        monitor_sql_injection($input);
    }
}

foreach ($_SERVER as $key => $value) {
    monitor_sql_injection($value);
}

// 14. Detect Zero-Day Exploits via Anomaly Detection
function detect_anomalies() {
    $anomalous_patterns = array('/\.\.\//', '/proc\/self\/environ/', '/\bpasswd\b/', '/\/etc\/\b/');

    foreach ($_SERVER as $key => $value) {
        foreach ($anomalous_patterns as $pattern) {
            if (preg_match($pattern, $value)) {
                http_response_code(403);
                die('Potential zero-day exploit detected.');
            }
        }
    }
}

// Detect anomalies in requests
detect_anomalies();

// 15. Rate Limiting to Prevent DDoS
function rate_limit($ip_address, $max_requests = 100, $time_window = 3600) {
    $cache_file = '/path/to/your/logs/rate_limit_' . md5($ip_address);
    
    if (file_exists($cache_file)) {
        $data = json_decode(file_get_contents($cache_file), true);
    } else {
        $data = array('requests' => 0, 'start_time' => time());
    }

    if ($data['requests'] > $max_requests) {
        if ((time() - $data['start_time']) < $time_window) {
            http_response_code(429);
            die('Too many requests. Please try again later.');
        } else {
            $data['requests'] = 0;
            $data['start_time'] = time();
        }
    }

    $data['requests']++;
    file_put_contents($cache_file, json_encode($data));
}

// Example rate limit usage
rate_limit($_SERVER['REMOTE_ADDR']);

// 16. Role-Based Access Control (RBAC)
function enforce_rbac($required_role) {
    $user_role = $this->session->userdata('user_role');

    if ($user_role !== $required_role) {
        http_response_code(403);
        die('Access denied. Insufficient permissions.');
    }
}

// Example RBAC enforcement
enforce_rbac('admin');

// 17. Rotate Session ID After Login
function rotate_session_id() {
    session_regenerate_id(true);
}

// Rotate session ID after successful login
if ($this->session->userdata('logged_in')) {
    rotate_session_id();
}

// 18. Check for Library Updates
function check_library_updates() {
    // This is a placeholder function. Implement your own update mechanism.
    $current_version = '1.0.0';
    $latest_version = '1.0.1'; // This would be retrieved from an external source

    if (version_compare($current_version, $latest_version, '<')) {
        echo 'New library update available. Please update to the latest version.';
    }
}

// Check for library updates
check_library_updates();

// Implementing All Checks
$files = scan_files('/path/to/your/codeigniter/application');
foreach ($files as $file) {
    check_for_backdoor($file);

    // Log file access
    log_file_activity('File accessed', $file);

    // Validate file inclusion example
    if (!validate_file_inclusion($file)) {
        die('Unauthorized file inclusion attempt detected.');
    }
}

// Example usage of upload validation
if ($_FILES) {
    foreach ($_FILES as $file) {
        if (!validate_upload($file)) {
            die('Suspicious file upload detected.');
        }
    }
}

// Example API request authentication
authenticate_api_request();

// Log the start of script execution for audit purposes
log_file_activity('Script execution started', __FILE__);

// Log script completion for audit purposes
log_file_activity('Script execution completed', __FILE__);
?>