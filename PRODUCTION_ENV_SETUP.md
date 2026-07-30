# Production Environment Variables Setup

## Issue
Logout and email links are redirecting to `localhost:3000` instead of `andiza.rw` in production.

## Root Cause
The `NEXTAUTH_URL` environment variable is not set correctly in your production hosting platform.

## Solution

### Step 1: Access Your Hosting Platform Dashboard

**If using Vercel:**
1. Go to https://vercel.com/dashboard
2. Select your project (andiza)
3. Go to Settings → Environment Variables

**If using Netlify:**
1. Go to https://app.netlify.com
2. Select your site
3. Go to Site settings → Environment variables

**If using other platforms:**
- Look for "Environment Variables" or "Config Vars" in your dashboard

### Step 2: Set/Update Environment Variables

Add or update the following environment variable:

```
NEXTAUTH_URL=https://andiza.rw
```

**Important**: Make sure there are NO trailing slashes!
- ✅ Correct: `https://andiza.rw`
- ❌ Wrong: `https://andiza.rw/`

### Step 3: Verify All Required Environment Variables

Ensure these are all set in production:

```
TURSO_DATABASE_URL=libsql://andiza-laurier.aws-us-east-1.turso.io
TURSO_AUTH_TOKEN=eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9...
NEXTAUTH_SECRET=+n19EyrKgTsGXstzRuqi0VtVZR9YulkWkAzTsrTkW+0=
NEXTAUTH_URL=https://andiza.rw
RESEND_API_KEY=re_VakzLr3M_FuVQwk74CkmNk8uGrfVGDzBZ
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=EGQYTV8YDQ45dmz2sMK0KJdWMrdFREQEvarm9Vumi2g
NEXT_PUBLIC_YANDEX_VERIFICATION=48e46663851b9fe0
```

### Step 4: Redeploy

After setting the environment variables:
1. Trigger a new deployment (or it may auto-deploy)
2. Wait for the build to complete

### Step 5: Test

After deployment, test the following:

1. **Logout Test**:
   - Login to your site
   - Click logout
   - Should redirect to `https://andiza.rw` (not localhost)

2. **Email Links Test**:
   - Trigger a test email (e.g., signup, booking confirmation)
   - Check that all links in the email point to `https://andiza.rw`

3. **Chat Functionality Test**:
   - Go to a venue or service page
   - Click "Chat with Vendor"
   - Should open messages page with conversation selected

## Why This Happens

NextAuth uses the `NEXTAUTH_URL` environment variable to:
- Generate redirect URLs after login/logout
- Create callback URLs
- Build absolute URLs for emails

If this variable is not set in production, NextAuth may:
- Fall back to localhost
- Use incorrect URLs
- Cause authentication issues

## Email Templates

All email templates in `lib/email.ts` use:
```javascript
process.env.NEXTAUTH_URL || 'https://andiza.rw'
```

This means they have a fallback, but it's better to set the environment variable explicitly.

## Local Development

For local development, your `.env` file should have:
```
NEXTAUTH_URL=http://localhost:3000
```

This file is NOT pushed to git (it's in `.gitignore`), so local and production environments are separate.

## Troubleshooting

**If logout still redirects to localhost after setting the variable:**
1. Verify the environment variable is saved in your hosting platform
2. Check for typos in the variable name (it's case-sensitive)
3. Ensure you redeployed after setting the variable
4. Clear your browser cache and cookies
5. Check the build logs for any errors

**If emails still have localhost links:**
1. Verify `NEXTAUTH_URL` is set correctly
2. Check that the email service (Resend) is working
3. Look at the email HTML source to see what URL is being used

## Additional Resources

- [NextAuth.js Environment Variables](https://next-auth.js.org/configuration/options#nextauth_url)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Netlify Environment Variables](https://docs.netlify.com/environment-variables/overview/)
