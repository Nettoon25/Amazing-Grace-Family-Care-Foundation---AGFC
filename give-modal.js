/* AGCF donation modal — FRONT-END DEMO ONLY. No real payments are processed. */
(() => {
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
          <fieldset><legend>Choose payment method</legend><label class="agcf-payment-choice"><input type="radio" name="paymentMethod" value="mpesa" checked><span><strong>M-Pesa</strong><small>Enter a phone number to simulate an M-Pesa prompt.</small></span></label><label class="agcf-payment-choice"><input type="radio" name="paymentMethod" value="card"><span><strong>Debit or credit card</strong><small>Enter sample card details to test the checkout layout.</small></span></label></fieldset>
          <section id="agcf-mpesa-fields" class="agcf-method-fields" aria-label="M-Pesa details">
            <h3>M-Pesa details</h3>
            <label for="agcf-phone-entry">Phone number</label>
            <input id="agcf-phone-entry" name="mpesaPhone" type="tel" inputmode="tel" autocomplete="off" placeholder="0712 345 678" pattern="[+0-9 ()-]{9,16}" />
            <p class="agcf-field-hint">Demo mode: no real STK push will be sent.</p>
          </section>
          <section id="agcf-card-fields" class="agcf-method-fields" aria-label="Debit or credit card details" hidden>
            <h3>Debit or credit card</h3>
            <p class="agcf-demo-warning">Testing only — use the sample values shown below. Do not enter real card details.</p>
            <label for="agcf-card-name">Name on card</label><input id="agcf-card-name" name="cardName" autocomplete="off" placeholder="TEST USER" />
            <label for="agcf-card-number">Card number</label><input id="agcf-card-number" name="cardNumber" inputmode="numeric" autocomplete="off" maxlength="19" placeholder="4242 4242 4242 4242" />
            <div class="agcf-card-row"><div><label for="agcf-card-expiry">Expiry date</label><input id="agcf-card-expiry" name="cardExpiry" autocomplete="off" maxlength="5" placeholder="12/30" /></div><div><label for="agcf-card-cvv">CVV</label><input id="agcf-card-cvv" name="cardCvv" inputmode="numeric" autocomplete="off" maxlength="4" placeholder="123" /></div></div>
            <p class="agcf-field-hint">Sample card: 4242 4242 4242 4242 · expiry 12/30 · CVV 123</p>
          </section>
          <p class="agcf-security-note">This is a front-end simulation. It does not contact M-Pesa, a bank, or a payment provider, and no money is charged.</p>
          <button id="agcf-submit" class="agcf-submit" type="submit">Simulate donation</button><p id="agcf-message" class="agcf-message" role="status" aria-live="polite"></p>
        </form>
      </div>
    </section>
  </div>`;

  const thisScript = document.currentScript;
  const scriptBase = thisScript && thisScript.src ? thisScript.src : new URL('give-modal.js', window.location.href).href;
  const cssUrl = new URL('give-modal.css', scriptBase).href;
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

  const mpesaFields = document.querySelector('#agcf-mpesa-fields');
  const cardFields = document.querySelector('#agcf-card-fields');
  const paymentRadios = [...form.querySelectorAll('input[name="paymentMethod"]')];
  const phoneEntry = document.querySelector('#agcf-phone-entry');
  const cardName = document.querySelector('#agcf-card-name');
  const cardNumber = document.querySelector('#agcf-card-number');
  const cardExpiry = document.querySelector('#agcf-card-expiry');
  const cardCvv = document.querySelector('#agcf-card-cvv');

  function selectedMethod() { return form.querySelector('input[name="paymentMethod"]:checked')?.value || 'mpesa'; }
  function updatePaymentFields() {
    const method = selectedMethod();
    mpesaFields.hidden = method !== 'mpesa';
    cardFields.hidden = method !== 'card';
    phoneEntry.required = method === 'mpesa';
    cardName.required = cardNumber.required = cardExpiry.required = cardCvv.required = method === 'card';
    submitButton.textContent = method === 'mpesa' ? 'Simulate M-Pesa payment' : 'Simulate card payment';
    showMessage('');
  }
  paymentRadios.forEach(radio => radio.addEventListener('change', updatePaymentFields));
  updatePaymentFields();
  cardNumber.addEventListener('input', () => {
    const digits = cardNumber.value.replace(/\D/g, '').slice(0, 16);
    cardNumber.value = digits.replace(/(.{4})/g, '$1 ').trim();
  });
  cardExpiry.addEventListener('input', () => {
    const digits = cardExpiry.value.replace(/\D/g, '').slice(0, 4);
    cardExpiry.value = digits.length > 2 ? digits.slice(0, 2) + '/' + digits.slice(2) : digits;
  });
  function showMessage(text, kind = '') { message.textContent = text; message.className = `agcf-message ${kind}`; }

  form.addEventListener('submit', async event => {
    event.preventDefault();
    showMessage('');
    const amount = Number(amountInput.value);
    if (!Number.isInteger(amount) || amount < 10 || amount > 1000000) {
      showMessage('Enter a whole-number donation between KSh 10 and KSh 1,000,000.', 'error'); return;
    }
    const method = selectedMethod();
    if (method === 'mpesa') {
      const phone = phoneEntry.value.trim();
      if (!/^(?:\+?254|0)?[17]\d{8}$/.test(phone.replace(/[ ()-]/g, ''))) {
        showMessage('Enter a valid Kenyan test phone number, for example 0712345678.', 'error'); phoneEntry.focus(); return;
      }
    } else {
      const digits = cardNumber.value.replace(/\D/g, '');
      if (cardName.value.trim().length < 2 || digits !== '4242424242424242' || !/^\d{2}\/\d{2}$/.test(cardExpiry.value) || !/^\d{3,4}$/.test(cardCvv.value)) {
        showMessage('For this demo, use TEST USER, card 4242 4242 4242 4242, expiry 12/30 and CVV 123.', 'error'); return;
      }
    }
    submitButton.disabled = true;
    submitButton.textContent = 'Processing demo…';
    await new Promise(resolve => setTimeout(resolve, 700));
    const receipt = 'DEMO-' + Math.random().toString(36).slice(2, 8).toUpperCase();
    const methodLabel = method === 'mpesa' ? 'M-Pesa' : 'card';
    showMessage(`TEST PAYMENT SUCCESSFUL — KSh ${amount.toLocaleString()} paid successfully via ${methodLabel}. Demo receipt: ${receipt}. No money was charged.`, 'success');
    submitButton.disabled = false;
    submitButton.textContent = 'Simulate another payment';
  });

  // Provider-return handling will be added when the backend is integrated.
})();
