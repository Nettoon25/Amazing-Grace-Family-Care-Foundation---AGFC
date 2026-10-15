# AGCF donation API starter

This is a starter implementation, not a certification that your merchant accounts are approved for production. Test in sandbox and have a qualified developer review the deployment before accepting real donations.

## Requirements
- Node.js 20+
- PostgreSQL database with TLS
- Public HTTPS backend URL
- Daraja sandbox/live app credentials and an approved M-Pesa shortcode/passkey
- Pesapal API credentials and a registered IPN URL for card checkout

## Local setup
1. Copy `.env.example` to `.env` and fill in values. Never commit `.env`.
2. `npm install`
3. `npm run dev`
4. Your local API is at `http://localhost:8080`; callbacks will not work locally unless you expose the server through a secure temporary HTTPS tunnel. Never use a temporary tunnel for production.

## Required environment values
Add `PUBLIC_API_URL=https://YOUR-BACKEND-HOST` to `.env`; this must be the public HTTPS URL of this API, without a trailing slash. Set `SITE_ORIGIN` to the exact origin hosting `give.html` (e.g. `https://yourname.github.io` or `https://amazinggracefamilycare.org`). If your Pages site is a project site, the origin is still the host only, not the repository path; update `site/give.js` API URL to the backend URL.

## Pesapal IPN registration
Register `https://YOUR-BACKEND-HOST/api/payments/pesapal/ipn` as an IPN endpoint in Pesapal's dashboard/API. Copy the returned notification ID into `PESAPAL_NOTIFICATION_ID`. The API uses Pesapal's transaction-status endpoint to verify payment, rather than trusting the browser redirect/IPN as proof.

## Deployment
Deploy this backend as a Node web service and attach a managed PostgreSQL database. Set all environment variables in the host's secret/environment settings, not in GitHub Pages. Ensure the backend has a persistent database, TLS, logs, backups and monitoring. The backend host must allow inbound HTTPS requests from Safaricom and Pesapal. Configure `SITE_ORIGIN` exactly to avoid CORS errors.

## Important production review items
- Daraja's callback payload is not cryptographically signed. This starter performs a server-to-server STK query before confirming success and checks the callback amount/receipt. Review Safaricom's current callback/IP allowlisting guidance and reconcile transactions against the merchant statement.
- Do not consider a donation paid based only on a browser return URL.
- Add administrator authentication and an audit trail before building a donations dashboard.
- Add email receipts only after payment status is verified.
- Review data-protection obligations for donor contact details; collect only what is needed and publish a privacy notice.
- Test failed, cancelled, delayed, duplicate and reversed payments in sandbox.
