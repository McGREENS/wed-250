<?php
/**
 * Relay configuration — copy this file to config.php on the server.
 * NEVER commit config.php to git (it is in .gitignore).
 *
 * Security: config.php is denied by .htaccess so it cannot be served
 * directly even if it ends up in public_html.
 */

// A long random secret shared between Vercel and this relay.
// Generate with: openssl rand -hex 32
// Must match RELAY_SECRET in your Vercel environment variables.
define('RELAY_SECRET', 'REPLACE_WITH_A_LONG_RANDOM_SECRET_32_CHARS_MIN');

// The only upstream host this relay will ever forward to.
// Hard-coded here as a second line of defence (index.php also hard-codes it).
define('ALLOWED_UPSTREAM_HOST', 'gate.centiwise.com');

// Path prefixes this relay will accept.
// Any request whose path does not start with one of these is rejected with 403.
define('ALLOWED_PATH_PREFIXES', [
    '/paynet/api/v2/',
    '/paynet/api/v4/',
]);
