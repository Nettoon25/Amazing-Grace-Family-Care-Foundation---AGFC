/* AGCF donation modal. Set API_BASE to your deployed backend HTTPS origin. */
(() => {
  const DEMO_MODE = true; // Frontend-only simulation. No payments are processed or details sent.
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
          <fieldset class="agcf-method-fieldset"><legend>Choose payment method</legend>
            <label class="agcf-payment-choice"><input type="radio" name="paymentMethod" value="mpesa" checked><span><strong>M-Pesa</strong><small>Open the M-Pesa details below.</small></span></label>
            <div class="agcf-method-panel" id="agcf-mpesa-panel">
              <label for="agcf-phone">M-Pesa phone number</label>
              <input id="agcf-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="e.g. 0712 345 678" required>
              <p class="agcf-field-hint">In live mode, this number would receive an M-Pesa payment prompt.</p>
            </div>
            <label class="agcf-payment-choice"><input type="radio" name="paymentMethod" value="card"><span><strong>Debit or credit card</strong><small>Open the card details below.</small></span></label>
            <div class="agcf-method-panel" id="agcf-card-panel" hidden>
              <div class="agcf-demo-warning"><strong>Demo only:</strong> Do not enter real card details. This mock form does not charge a card and does not send or store these entries.</div>
              <label for="agcf-card-name">Name on card</label><input id="agcf-card-name" name="cardName" autocomplete="off" placeholder="Demo cardholder" disabled>
              <label for="agcf-card-number">Card number</label><input id="agcf-card-number" name="cardNumber" inputmode="numeric" autocomplete="off" placeholder="4242 4242 4242 4242" maxlength="23" disabled>
              <div class="agcf-form-grid agcf-card-grid"><div><label for="agcf-card-expiry">Expiry date</label><input id="agcf-card-expiry" name="cardExpiry" autocomplete="off" placeholder="MM/YY" maxlength="5" disabled></div><div><label for="agcf-card-cvv">CVV</label><input id="agcf-card-cvv" name="cardCvv" inputmode="numeric" autocomplete="off" placeholder="123" maxlength="4" disabled></div></div>
            </div>
          </fieldset>
          <p class="agcf-security-note">🔒 This is a frontend demonstration. No money will be moved. Never share your M-Pesa PIN with anyone.</p>
          <button id="agcf-submit" class="agcf-submit" type="submit">Simulate donation</button><p id="agcf-message" class="agcf-message" role="status" aria-live="polite"></p>
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

  const methodPanels = {
    mpesa: modal.querySelector('#agcf-mpesa-panel'),
    card: modal.querySelector('#agcf-card-panel')
  };
  const phoneInput = modal.querySelector('#agcf-phone');
  const cardInputs = [...modal.querySelectorAll('#agcf-card-name, #agcf-card-number, #agcf-card-expiry, #agcf-card-cvv')];
  const methodRadios = [...modal.querySelectorAll('input[name="paymentMethod"]')];

  function updatePaymentPanel() {
    const selected = form.querySelector('input[name="paymentMethod"]:checked')?.value || 'mpesa';
    methodPanels.mpesa.hidden = selected !== 'mpesa';
    methodPanels.card.hidden = selected !== 'card';
    phoneInput.required = selected === 'mpesa';
    phoneInput.disabled = selected !== 'mpesa';
    cardInputs.forEach(input => {
      input.disabled = selected !== 'card';
      input.required = selected === 'card';
    });
    submitButton.textContent = DEMO_MODE ? 'Simulate donation' : 'Continue to secure payment';
    showMessage('');
  }
  methodRadios.forEach(radio => radio.addEventListener('change', updatePaymentPanel));

  // Demo-only formatting helpers. Values are never sent to a server or stored.
  const cardNumberInput = modal.querySelector('#agcf-card-number');
  cardNumberInput.addEventListener('input', () => {
    const digits = cardNumberInput.value.replace(/\D/g, '').slice(0, 19);
    cardNumberInput.value = digits.replace(/(.{4})/g, '$1 ').trim();
  });
  const expiryInput = modal.querySelector('#agcf-card-expiry');
  expiryInput.addEventListener('input', () => {
    const digits = expiryInput.value.replace(/\D/g, '').slice(0, 4);
    expiryInput.value = digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
  });
  modal.querySelector('#agcf-card-cvv').addEventListener('input', event => {
    event.target.value = event.target.value.replace(/\D/g, '').slice(0, 4);
  });

  form.addEventListener('submit', async event => {
    event.preventDefault();
    showMessage('');
    const data = new FormData(form);
    const amount = Number(data.get('amount'));
    const paymentMethod = data.get('paymentMethod');
    if (!Number.isInteger(amount) || amount < 10 || amount > 1000000) {
      showMessage('Enter a whole-number donation between KSh 10 and KSh 1,000,000.', 'error');
      return;
    }
    if (paymentMethod === 'mpesa') {
      const phone = String(data.get('phone') || '').replace(/[\s-]/g, '');
      if (!/^(?:254|0)?7\d{8}$/.test(phone)) {
        showMessage('Enter a valid Kenyan M-Pesa number, for example 0712345678.', 'error');
        phoneInput.focus();
        return;
      }
    } else {
      const cardName = String(data.get('cardName') || '').trim();
      const cardNumber = String(data.get('cardNumber') || '').replace(/\s/g, '');
      const expiry = String(data.get('cardExpiry') || '').trim();
      const cvv = String(data.get('cardCvv') || '').trim();
      if (!cardName || !/^\d{12,19}$/.test(cardNumber) || !/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry) || !/^\d{3,4}$/.test(cvv)) {
        showMessage('For this visual demo, fill in the sample card fields using test-only values. Do not use a real card.', 'error');
        return;
      }
    }

    if (DEMO_MODE) {
      // Intentionally do not call fetch(), store card details, or send form values anywhere.
      submitButton.disabled = true;
      submitButton.textContent = 'Simulating…';
      window.setTimeout(() => {
        const methodName = paymentMethod === 'mpesa' ? 'M-Pesa' : 'debit/credit card';
        showMessage(`DEMO SUCCESS: KSh ${amount.toLocaleString()} paid successfully using ${methodName}. No money was charged; this is only a test message.`, 'success');
        returnStatus.hidden = false;
        returnStatus.textContent = `Demo receipt: KSh ${amount.toLocaleString()} · ${data.get('purpose')} · Status: SIMULATED (not a real payment).`;
        submitButton.disabled = false;
        submitButton.textContent = 'Simulate another donation';
      }, 650);
      return;
    }

    showMessage('Live payment integration has not been enabled yet.', 'error');
  });
  updatePaymentPanel();

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
    if (DEMO_MODE) return;
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
