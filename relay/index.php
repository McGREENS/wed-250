<?php
/**
 * Centiwise Payment Gateway Relay
 *
 * Purpose:
 *   Vercel's outbound IPs are dynamic. Centiwise requires a whitelisted IP.
 *   This relay runs on a cPanel server with a fixed IP (197.243.23.16) and
 *   forwards payment requests from Vercel to Centiwise.
 *
 * Security model:
 *   - Accepts POST only
 *   - Requires X-Relay-Secret header (compared with hash_equals — timing-safe)
 *   - Upstream host is hard-coded; never taken from user input
 *   - Request path is validated against an allowlist of prefixes
 *   - Body is forwarded byte-for-byte from php://input (no re-encoding)
 *   - Authorization header is forwarded via X-Fwd-Auth (Apache strips Authorization)
 *   - Secrets are never logged
 *   - TLS verification is ON
 *   - Redirects are NOT followed
 *
 * PHP 7.4+ compatible.
 */

declare(strict_types=1);

// ── Bootstrap ─────────────────────────────────────────────────────────────────

$configFile = __DIR__ . '/config.php';
if (!file_exists($configFile)) {
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Relay not configured']);
    exit;
}
require $configFile;

// ── Constants (second defence layer — host never comes from user input) ────────
const UPSTREAM_HOST  = 'gate.centiwise.com';
const UPSTREAM_BASE  = 'https://gate.centiwise.com';

// ── Helper: send JSON error and exit ──────────────────────────────────────────
function fail(int $code, string $message): void
{
    http_response_code($code);
    header('Content-Type: application/json');
    // Never include internal details (secrets, paths, stack traces) in the response
    echo json_encode(['error' => $message]);
    exit;
}

// ── Helper: safe log (no secrets, no bodies) ──────────────────────────────────
function relay_log(string $level, string $message): void
{
    // Logs to PHP error_log (server error log) — adjust to file if preferred.
    // Format: [RELAY][LEVEL] YYYY-MM-DD HH:MM:SS | message
    $ts = gmdate('Y-m-d H:i:s');
    error_log("[RELAY][{$level}] {$ts} | {$message}");
}

// ── 1. Method check — POST only ───────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Allow: POST');
    fail(405, 'Method not allowed');
}

// ── 2. Secret verification (timing-safe) ─────────────────────────────────────
$incomingSecret = $_SERVER['HTTP_X_RELAY_SECRET'] ?? '';
if (!defined('RELAY_SECRET') || !hash_equals(RELAY_SECRET, $incomingSecret)) {
    // Log only that auth failed, never log the received secret
    relay_log('WARN', 'Rejected request: invalid or missing X-Relay-Secret');
    fail(403, 'Forbidden');
}

// ── 3. Extract and validate the request path ─────────────────────────────────
// PATH_INFO is set when .htaccess rewrites to index.php; fall back to REQUEST_URI.
$rawPath = $_SERVER['PATH_INFO'] ?? parse_url($_SERVER['REQUEST_URI'] ?? '', PHP_URL_PATH) ?? '';

// Strip any leading script name if mod_rewrite passes it through
if (str_starts_with($rawPath, '/index.php')) {
    $rawPath = substr($rawPath, strlen('/index.php'));
}

// Security: reject paths with traversal attempts or suspicious characters
if (
    str_contains($rawPath, '..')   ||   // directory traversal
    str_contains($rawPath, '//')   ||   // double slash
    preg_match('#%2[fF]|%5[cC]#', $rawPath) ||  // encoded slashes/backslashes
    preg_match('/[\x00-\x1f\x7f]/', $rawPath)    // control characters
) {
    relay_log('WARN', 'Rejected request: suspicious path characters');
    fail(403, 'Forbidden');
}

// Allowlist check: path must start with one of the configured prefixes
$allowedPrefixes = defined('ALLOWED_PATH_PREFIXES') ? ALLOWED_PATH_PREFIXES : ['/paynet/api/v2/', '/paynet/api/v4/'];
$pathAllowed = false;
foreach ($allowedPrefixes as $prefix) {
    if (str_starts_with($rawPath, $prefix)) {
        $pathAllowed = true;
        break;
    }
}
if (!$pathAllowed) {
    relay_log('WARN', "Rejected request: path not in allowlist ({$rawPath})");
    fail(403, 'Forbidden');
}

// ── 4. Build upstream URL ─────────────────────────────────────────────────────
// Host is ALWAYS the hard-coded constant — never from user input.
$queryString = $_SERVER['QUERY_STRING'] ?? '';
$upstreamUrl = UPSTREAM_BASE . $rawPath . ($queryString !== '' ? '?' . $queryString : '');

// ── 5. Read request body exactly as received ──────────────────────────────────
// file_get_contents('php://input') gives the raw bytes — no decoding, no re-encoding.
$requestBody = (string) file_get_contents('php://input');

// ── 6. Build forwarded headers ────────────────────────────────────────────────
// Apache strips the Authorization header before PHP sees it.
// Callers send it as X-Fwd-Auth; we restore it here for the upstream.
$forwardHeaders = [];

// Content-Type: forward as received
$contentType = $_SERVER['CONTENT_TYPE'] ?? $_SERVER['HTTP_CONTENT_TYPE'] ?? '';
if ($contentType !== '') {
    $forwardHeaders[] = 'Content-Type: ' . $contentType;
}

// Accept: forward as received
$accept = $_SERVER['HTTP_ACCEPT'] ?? '';
if ($accept !== '') {
    $forwardHeaders[] = 'Accept: ' . $accept;
}

// Authorization: rebuilt from X-Fwd-Auth (never log this value)
$fwdAuth = $_SERVER['HTTP_X_FWD_AUTH'] ?? '';
if ($fwdAuth !== '') {
    $forwardHeaders[] = 'Authorization: ' . $fwdAuth;
}

// Explicitly do NOT forward: X-Relay-Secret, X-Fwd-Auth, Cookie, Host

// ── 7. cURL request to upstream ───────────────────────────────────────────────
$ch = curl_init();

curl_setopt_array($ch, [
    CURLOPT_URL            => $upstreamUrl,
    CURLOPT_POST           => true,
    CURLOPT_POSTFIELDS     => $requestBody,      // raw bytes, no re-encoding
    CURLOPT_HTTPHEADER     => $forwardHeaders,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HEADER         => true,              // include response headers in output
    CURLOPT_SSL_VERIFYPEER => true,              // TLS verification ON
    CURLOPT_SSL_VERIFYHOST => 2,
    CURLOPT_FOLLOWLOCATION => false,             // never follow redirects
    CURLOPT_CONNECTTIMEOUT => 10,                // 10s connect timeout
    CURLOPT_TIMEOUT        => 30,                // 30s total timeout
    CURLOPT_HTTP_VERSION   => CURL_HTTP_VERSION_1_1,
    // Pin the upstream hostname for extra safety
    CURLOPT_RESOLVE        => [UPSTREAM_HOST . ':443:' . gethostbyname(UPSTREAM_HOST)],
]);

$rawResponse = curl_exec($ch);
$curlError   = curl_error($ch);
$curlErrno   = curl_errno($ch);
$httpStatus  = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
$headerSize  = (int) curl_getinfo($ch, CURLINFO_HEADER_SIZE);
curl_close($ch);

// ── 8. Handle cURL failure ────────────────────────────────────────────────────
if ($rawResponse === false || $curlErrno !== 0) {
    // Log the error code but NOT the full message (may contain internal details)
    relay_log('ERROR', "cURL failed with errno {$curlErrno} for path {$rawPath}");
    fail(502, 'Gateway error');
}

// ── 9. Extract response body and Content-Type ─────────────────────────────────
$responseBody    = substr((string) $rawResponse, $headerSize);
$responseHeaders = substr((string) $rawResponse, 0, $headerSize);

// Extract Content-Type from response headers
$upstreamContentType = 'application/octet-stream';
foreach (explode("\r\n", $responseHeaders) as $headerLine) {
    if (stripos($headerLine, 'Content-Type:') === 0) {
        $upstreamContentType = trim(substr($headerLine, strlen('Content-Type:')));
        break;
    }
}

// ── 10. Return gateway response unchanged ────────────────────────────────────
relay_log('INFO', "Proxied {$rawPath} → HTTP {$httpStatus}");

http_response_code($httpStatus);
header('Content-Type: ' . $upstreamContentType);
// Security headers for the relay itself
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
echo $responseBody;
