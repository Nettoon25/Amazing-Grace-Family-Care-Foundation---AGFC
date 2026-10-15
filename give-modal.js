/* AGCF donation modal. Set API_BASE to your deployed backend HTTPS origin. */
(() => {
  const API_BASE = 'https://YOUR-BACKEND-HOST';
  const markup = `
  <div id="agcf-give-modal" hidden aria-hidden="true">
    <div class="agcf-modal-backdrop" data-agcf-close="true"></div>
    <section class="agcf-modal-panel" role="dialog" aria-modal="true" aria-labelledby="agcf-modal-title" aria-describedby="agcf-modal-description" tabindex="-1">
      <header class="agcf-modal-head"><div><h2 id="agcf-modal-title">Make a donation</h2><p id="agcf-modal-description">Your generosity can change a life.</p></div><button class="agcf-modal-close" type="button" aria-label="Close donation window" data-agcf-close="true">&times;</button></header>
      <div class="agcf-modal-body">
        <div id="agcf-return-status" class="agcf-status" role="status" aria-live="polite" hidden></div>
        <form id="agcf-donation-form">
          <fieldset><legend>Choose an amount (KES)</legend><div class="agcf-amount-grid">
            <button type="button" class="agcf-amount-option" data-amount="100">KSh 100</button><button type="button" class="agcf-amount-option" data-amount="500">KSh 500</button><button type="button" class="agcf-amount-option" data-amount="1000">KSh 1,000</button><button type="button" class="agcf-amount-option" data-amount="2000">KSh 2,000</button>
          </div><label for="agcf-amount">Or enter another amount</label><div class="agcf-amount-input"><span>KSh</span><input id="agcf-amount" name="amount" type="number" min="10" max="1000000" step="1" placeholder="e.g. 1500" required></div></fieldset>
          <div><label for="agcf-purpose">Where would you like your donation to go?</label><select id="agcf-purpose" name="purpose" required><option value="General Giving">General Giving</option><option value="Orphans and Widows">Orphans and Widows</option><option value="Education Support">Education Support</option><option value="Disaster Relief">Disaster Relief</option><option value="Church Ministry">Church Ministry</option></select></div>
          <div class="agcf-form-grid"><div><label for="agcf-name">Your name (optional)</label><input id="agcf-name" name="name" autocomplete="name" maxlength="100" placeholder="Full name"></div><div><label for="agcf-email">Email (optional)</label><input id="agcf-email" name="email" type="email" autocomplete="email" maxlength="254" placeholder="you@example.com"></div></div>
          <div><label for="agcf-phone">M-Pesa phone number <span class="agcf-muted">(required for M-Pesa)</span></label><input id="agcf-phone" name="phone" type="tel" autocomplete="tel" placeholder="07XX XXX XXX"></div>
          <fieldset><legend>Choose payment method</legend><label class="agcf-payment-choice"><input type="radio" name="paymentMethod" value="mpesa" checked><span><strong>M-Pesa</strong><small>Receive a payment prompt on your phone.</small></span></label><label class="agcf-payment-choice"><input type="radio" name="paymentMethod" value="card"><span><strong>Debit or credit card</strong><small>Continue to the secure card provider checkout.</small></span></label></fieldset>
          <p class="agcf-security-note">🔒 Card details are entered only on the payment provider's secure checkout. Never share your M-Pesa PIN with anyone.</p>
          <button id="agcf-submit" class="agcf-submit" type="submit">Continue to secure payment</button><p id="agcf-message" class="agcf-message" role="status" aria-live="polite"></p>
        </form>
      </div>
    </section>
  </div>`;

  const cssUrl = new URL('give-modal.css', document.currentScript?.src || window.location.href).href;
  if (!document.querySelector('link[data-agcf-modal-css]')) {
    const link = document.createElement('link'); link.rel = 'stylesheet'; link.href = cssUrl; link.dataset.agcfModalCss = 'true'; document.head.appendChild(link);
  }
  document.body.insertAdjacentHTML('beforeend', markup);
  const modal = document.querySelector('#agcf-give-modal');
  const form = document.querySelector('#agcf-donation-form');
  const amountInput = document.querySelector('#agcf-amount');
  const message = document.querySelector('#agcf-message');
  const submitButton = document.querySelector('#agcf-submit');
  const returnStatus = document.querySelector('#agcf-return-status');
  let lastFocus = null;
  let pollTimer = null;

  function openModal() {
    lastFocus = document.activeElement;
    modal.hidden = false; modal.setAttribute('aria-hidden', 'false'); document.body.classList.add('agcf-modal-open');
    modal.querySelector('.agcf-modal-panel').focus(); modal.querySelector('.agcf-modal-close').focus();
  }
  function closeModal() {
    modal.hidden = true; modal.setAttribute('aria-hidden', 'true'); document.body.classList.remove('agcf-modal-open');
    if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
  }
  document.addEventListener('click', event => {
    const trigger = event.target.closest('a.give-btn, [data-open-give-modal]');
    if (trigger) { event.preventDefault(); openModal(); }
    if (event.target.closest('[data-agcf-close="true"]')) closeModal();
  });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && !modal.hidden) closeModal(); });

  modal.querySelectorAll('.agcf-amount-option').forEach(button => button.addEventListener('click', () => {
    amountInput.value = button.dataset.amount;
    modal.querySelectorAll('.agcf-amount-option').forEach(item => item.classList.toggle('active', item === button));
  }));
  amountInput.addEventListener('input', () => modal.querySelectorAll('.agcf-amount-option').forEach(item => item.classList.toggle('active', Number(item.dataset.amount) === Number(amountInput.value))));

  function showMessage(text, kind = '') { message.textContent = text; message.className = `agcf-message ${kind}`; }
  async function apiRequest(path, options = {}) {
    const response = await fetch(`${API_BASE}${path}`, { ...options, headers: { 'Content-Type': 'application/json', ...(options.headers || {}) } });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || 'The request failed. Please try again.');
    return data;
  }
  function configureMessage() {
    if (API_BASE.includes('YOUR-BACKEND-HOST')) { showMessage('The donation system is not configured yet. Set API_BASE in give-modal.js to your deployed backend URL.', 'error'); return false; }
    return true;
  }
  form.addEventListener('submit', async event => {
    event.preventDefault(); showMessage('');
    if (!configureMessage()) return;
    const data = new FormData(form); const amount = Number(data.get('amount')); const paymentMethod = data.get('paymentMethod');
    if (!Number.isInteger(amount) || amount < 10 || amount > 1000000) { showMessage('Enter a whole-number donation between KSh 10 and KSh 1,000,000.', 'error'); return; }
    if (paymentMethod === 'mpesa' && !String(data.get('phone') || '').trim()) { showMessage('Enter the M-Pesa phone number that should receive the payment prompt.', 'error'); return; }
    submitButton.disabled = true; submitButton.textContent = 'Connecting securely…';
    try {
      const created = await apiRequest('/api/donations', { method:'POST', body:JSON.stringify({ amount, purpose:data.get('purpose'), name:data.get('name'), email:data.get('email'), phone:data.get('phone'), paymentMethod }) });
      if (paymentMethod === 'mpesa') {
        await apiRequest(`/api/donations/${encodeURIComponent(created.donationId)}/mpesa`, { method:'POST', body:JSON.stringify({}) });
        sessionStorage.setItem('agcfPendingDonation', created.donationId);
        showMessage('Payment prompt requested. Check your phone, confirm the amount and enter your M-Pesa PIN. Keep this window open while we check the result.', 'success');
        submitButton.textContent = 'Waiting for M-Pesa confirmation…'; await pollMpesa(created.donationId);
      } else {
        const checkout = await apiRequest(`/api/donations/${encodeURIComponent(created.donationId)}/card`, { method:'POST', body:JSON.stringify({}) });
        window.location.assign(checkout.redirectUrl);
      }
    } catch (error) { showMessage(error.message, 'error'); submitButton.disabled = false; submitButton.textContent = 'Continue to secure payment'; }
  });

  async function pollMpesa(donationId) {
    for (let i=0; i<36; i++) {
      await new Promise(resolve => setTimeout(resolve, 5000));
      try {
        const status = await apiRequest(`/api/donations/${encodeURIComponent(donationId)}/status`);
        if (status.status === 'paid') { showMessage(`Thank you. Your donation of KSh ${Number(status.amount_kes).toLocaleString()} has been confirmed.${status.provider_reference ? ` Receipt: ${status.provider_reference}.` : ''}`, 'success'); sessionStorage.removeItem('agcfPendingDonation'); submitButton.textContent = 'Donation confirmed'; return; }
        if (['failed','cancelled','reversed'].includes(status.status)) { showMessage(`The payment status is ${status.status}. If money was deducted, contact the foundation before trying again.`, 'error'); submitButton.disabled = false; submitButton.textContent = 'Try another donation'; return; }
      } catch { /* transient polling failure: retry */ }
    }
    showMessage('Confirmation has not arrived yet. This does not mean payment failed. Please check again later and avoid paying twice.', ''); submitButton.disabled = false; submitButton.textContent = 'Try again later';
  }

  async function handleProviderReturn() {
    const params = new URLSearchParams(window.location.search); const donationId = params.get('donationId'); const payment = params.get('payment'); const trackingId = params.get('OrderTrackingId');
    if (payment === 'cancelled') { openModal(); showMessage('The card checkout was cancelled. No successful payment has been confirmed.', ''); history.replaceState({}, '', location.pathname); return; }
    if (!donationId || payment !== 'card') return;
    openModal(); returnStatus.hidden = false; returnStatus.textContent = 'Checking your payment with the payment provider…';
    try {
      for (let i=0; i<8; i++) {
        const suffix = trackingId ? `?OrderTrackingId=${encodeURIComponent(trackingId)}` : '';
        const status = await apiRequest(`/api/donations/${encodeURIComponent(donationId)}/status${suffix}`);
        if (status.status === 'paid') { returnStatus.textContent = `Thank you. Your donation of KSh ${Number(status.amount_kes).toLocaleString()} has been verified.${status.provider_reference ? ` Reference: ${status.provider_reference}.` : ''}`; break; }
        if (['failed','reversed','cancelled'].includes(status.status)) { returnStatus.textContent = `The provider reports status: ${status.status}. If your account was charged, contact the foundation before retrying.`; break; }
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    } catch (error) { returnStatus.textContent = `We could not verify the payment right now. Please try again later. ${error.message}`; }
    history.replaceState({}, '', location.pathname);
  }
  handleProviderReturn();
  const pending = sessionStorage.getItem('agcfPendingDonation');
  if (pending) { /* A refresh can happen while a provider callback is still pending. */ }
})();
