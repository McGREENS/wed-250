# Centiwise Relay — Setup Guide

The PHP relay solves the Vercel rotating-IP problem: all Centiwise API calls
are forwarded through our cPanel server (fixed IP **197.243.23.16**), which
Centiwise has whitelisted.

```
Browser → Vercel (andiza.co.rw) → relay.andiza.co.rw (197.243.23.16) → gate.centiwise.com
```

---

## 1. Create the subdomain in cPanel

1. Log in to cPanel → **Subdomains**
2. Create subdomain: `relay` → Document Root: `/public_html/relay.andiza.co.rw`
3. In Cloudflare DNS, add an **A record**:
   - Name: `relay`
   - Value: `197.243.23.16`
   - Proxy: **DNS only** (grey cloud — NOT proxied)

   > The relay must NOT go through Cloudflare proxy, otherwise the outbound IP
   > seen by Centiwise would be Cloudflare's, not our server's.

---

## 2. Upload relay files to cPanel

Upload everything in the `relay/` folder of this repo to `/public_html/relay.andiza.co.rw/`:

```
relay/
  index.php
  .htaccess
  config.sample.php   ← do NOT rename this; create config.php separately (step 3)
  diag-ip.php         ← delete after verification (step 5)
```

You can use cPanel File Manager or FTP (FileZilla etc.).

---

## 3. Create config.php on the server

**Do not upload config.php from your local machine** — it contains the relay secret.

In cPanel File Manager, inside `/public_html/relay.andiza.co.rw/`, create a new file
called `config.php` with this content:

```php
<?php
define('RELAY_SECRET', 'PASTE_YOUR_RELAY_SECRET_HERE');
define('ALLOWED_UPSTREAM_HOST', 'gate.centiwise.com');
define('ALLOWED_PATH_PREFIXES', ['/paynet/api/v2/', '/paynet/api/v4/']);
```

Replace `PASTE_YOUR_RELAY_SECRET_HERE` with the value of `RELAY_SECRET` from your
`.env` file (the 64-character hex string).

---

## 4. Set Vercel environment variables

In Vercel → your project → **Settings → Environment Variables**, add:

| Variable | Value |
|---|---|
| `RELAY_BASE_URL` | `https://relay.andiza.co.rw` |
| `RELAY_SECRET` | *(same value as in config.php above)* |
| `CENTIWISE_LOGIN` | `Andiza_cw` |
| `CENTIWISE_CONTROL_KEY` | *(from Centiwise email)* |
| `CENTIWISE_ENDPOINT_ID` | `108048` |
| `CENTIWISE_CALLBACK_URL` | `https://andiza.co.rw/api/subscriptions/centiwise/callback` |

Set all to **Production** (and Preview if needed). Then **Redeploy**.

---

## 5. Verify the relay outbound IP

```bash
curl -s -H "X-Relay-Secret: YOUR_RELAY_SECRET" \
  https://relay.andiza.co.rw/diag-ip.php
```

Expected response:
```json
{"outbound_ip":"197.243.23.16","expected":"197.243.23.16","status":"ok"}
```

If `outbound_ip` does not match `197.243.23.16`, stop and contact your hosting provider —
the wrong IP will be rejected by Centiwise.

**Delete diag-ip.php immediately after this check:**
```bash
# In cPanel File Manager, delete /public_html/relay.andiza.co.rw/diag-ip.php
```

---

## 6. Tell Centiwise to whitelist the relay IP

Send to Godwin:

> Please whitelist **197.243.23.16** for endpoint **108048**.
> This is the fixed IP of our relay server. All production requests will come from this IP.

---

## 7. Run the test script

From the project root on your local machine:

```bash
node relay/test-relay.mjs
```

This checks:
- Missing secret → 403
- Wrong path → 403
- GET request → 405
- Valid payment request → Centiwise redirect URL

---

## 8. Security checklist before going live

- [ ] `diag-ip.php` deleted from server
- [ ] `config.php` is NOT in git (it is in `.gitignore`)
- [ ] `relay.andiza.co.rw` DNS is **DNS only** (not Cloudflare proxied)
- [ ] `RELAY_SECRET` set in Vercel environment variables
- [ ] Centiwise has confirmed `197.243.23.16` is whitelisted
- [ ] Test payment of 300 RWF completed successfully end-to-end
