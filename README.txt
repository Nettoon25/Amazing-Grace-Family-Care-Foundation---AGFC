AGFC DONATION MODAL — FRONT-END DEMO UPDATE

WHAT CHANGED
- Clicking Give opens the modal (via components.js).
- Choosing M-Pesa reveals the phone-number entry panel.
- Choosing Debit or credit card reveals the cardholder, card number, expiry and CVV fields.
- Selecting KSh 500 and submitting shows a clearly labelled test success message such as “TEST PAYMENT SUCCESSFUL — KSh 500 paid successfully”.
- Demo receipt numbers are generated locally in the browser.
- No backend requests are made, no M-Pesa prompt is sent, no card provider is opened, and no real money is charged.

INSTALL
1. Replace the site's current components.js with this components.js.
2. Put give-modal.js and give-modal.css in the same directory as components.js.
3. Keep the filenames exactly as shown (no “(1)” suffixes).
4. Ensure each page using the shared header includes <div id="site-header"></div> and loads components.js.
5. Deploy and hard refresh with Ctrl+Shift+R.

TEST
- Click Give.
- Select KSh 500.
- Select M-Pesa, enter a test Kenyan-format phone number (e.g. 0712345678), and submit.
- Select Debit or credit card and use TEST USER, 4242 4242 4242 4242, 12/30, and 123.
- The UI shows a simulated successful payment. These are demo messages only, not proof of a real payment.

SECURITY / NEXT STEP
Do not enter real payment card details into this demo. Card fields are for layout/testing only. When integrating payments, use the provider's official sandbox/hosted checkout or tokenized fields and verify payment status on your backend. Never store raw card numbers or CVVs. Backend credentials and M-Pesa STK Push integration belong server-side.
