<?php
/**
 * Diagnostic: confirm the server's outbound IP is 197.243.23.16.
 *
 * SECURITY:
 *   - Requires the same X-Relay-Secret header as the main relay.
 *   - DELETE THIS FILE after confirming the IP.
 *   - Do not leave it accessible in production.
 *
 * Usage:
 *   curl -H "X-Relay-Secret: YOUR_SECRET" https://relay.andiza.co.rw/diag-ip.php
 *
 * Expected response:
 *   {"outbound_ip":"197.243.23.16","status":"ok"}
 */

declare(strict_types=1);

$configFile = __DIR__ . '/config.php';
if (!file_exists($configFile)) {
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Relay not configured']);
    exit;
}
require $configFile;

// Require the relay secret — same check as index.php
$incomingSecret = $_SERVER['HTTP_X_RELAY_SECRET'] ?? '';
if (!defined('RELAY_SECRET') || !hash_equals(RELAY_SECRET, $incomingSecret)) {
    http_response_code(403);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Forbidden']);
    exit;
}

// Fetch our outbound IP via cURL (not file_get_contents, which may be disabled)
$ch = curl_init('https://api.ipify.org?format=json');
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_SSL_VERIFYPEER => true,
    CURLOPT_SSL_VERIFYHOST => 2,
    CURLOPT_CONNECTTIMEOUT => 10,
    CURLOPT_TIMEOUT        => 15,
    CURLOPT_HTTP_VERSION   => CURL_HTTP_VERSION_1_1,
]);
$result   = curl_exec($ch);
$errno    = curl_errno($ch);
curl_close($ch);

header('Content-Type: application/json');

if ($result === false || $errno !== 0) {
    http_response_code(502);
    echo json_encode(['error' => 'Could not fetch IP', 'curl_errno' => $errno]);
    exit;
}

$data = json_decode((string) $result, true);
$ip   = $data['ip'] ?? 'unknown';

echo json_encode([
    'outbound_ip' => $ip,
    'expected'    => '197.243.23.16',
    'status'      => $ip === '197.243.23.16' ? 'ok' : 'MISMATCH — wrong IP, do not give this IP to Centiwise',
]);
