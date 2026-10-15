/* Set this to the deployed backend's HTTPS origin, with no trailing slash. */
const API_BASE = 'https://YOUR-BACKEND-HOST';
const form = document.querySelector('#donation-form');
const amountInput = document.querySelector('#amount');
const message = document.querySelector('#form-message');
const submitButton = document.querySelector('#submit-button');
const returnStatus = document.querySelector('#return-status');
document.querySelector('#year').textContent = new Date().getFullYear();

for (const button of document.querySelectorAll('.amount-option')) {
  button.addEventListener('click', () => {
    amountInput.value = button.dataset.amount;
    document.querySelectorAll('.amount-option').forEach(item => item.classList.toggle('active', item === button));
  });
}
amountInput.addEventListener('input', () => document.querySelectorAll('.amount-option').forEach(item => item.classList.toggle('active', Number(item.dataset.amount) === Number(amountInput.value))));

function showMessage(text, kind = '') {
  message.textContent = text;
  message.className = `form-message ${kind}`;
}

async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) }
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || 'The request failed. Please try again.');
  return data;
}

form.addEventListener('submit', async event => {
  event.preventDefault();
  showMessage('');
  if (API_BASE.includes('YOUR-BACKEND-HOST')) {
    showMessage('The donation system is not configured yet. Set API_BASE in give.js to your deployed backend URL.', 'error');
    return;
  }
  const data = new FormData(form);
  const amount = Number(data.get('amount'));
  if (!Number.isInteger(amount) || amount < 10 || amount > 1000000) {
    showMessage('Enter a whole-number donation between KSh 10 and KSh 1,000,000.', 'error');
    return;
  }
  const paymentMethod = data.get('paymentMethod');
  if (paymentMethod === 'mpesa' && !String(data.get('phone') || '').trim()) {
    showMessage('Enter the M-Pesa phone number that should receive the payment prompt.', 'error');
    return;
  }
  submitButton.disabled = true;
  submitButton.textContent = 'Connecting securely…';
  try {
    const created = await apiRequest('/api/donations', {
      method: 'POST',
      body: JSON.stringify({ amount, purpose: data.get('purpose'), name: data.get('name'), email: data.get('email'), phone: data.get('phone'), paymentMethod })
    });
    if (paymentMethod === 'mpesa') {
      await apiRequest(`/api/donations/${created.donationId}/mpesa`, { method: 'POST', body: JSON.stringify({}) });
      sessionStorage.setItem('agcfPendingDonation', created.donationId);
      showMessage('Payment prompt requested. Check your phone, confirm the amount, and enter your M-Pesa PIN. Keep this page open while we check the result.', 'success');
      submitButton.textContent = 'Waiting for M-Pesa confirmation…';
      await pollMpesa(created.donationId);
    } else {
      const checkout = await apiRequest(`/api/donations/${created.donationId}/card`, { method: 'POST', body: JSON.stringify({}) });
      window.location.assign(checkout.redirectUrl);
    }
  } catch (error) {
    showMessage(error.message, 'error');
    submitButton.disabled = false;
    submitButton.textContent = 'Continue to secure payment';
  }
});

async function pollMpesa(donationId) {
  for (let i = 0; i < 36; i++) {
    await new Promise(resolve => setTimeout(resolve, 5000));
    try {
      const status = await apiRequest(`/api/donations/${encodeURIComponent(donationId)}/status`);
      if (status.status === 'paid') {
        showMessage(`Thank you. Your donation of KSh ${Number(status.amount_kes).toLocaleString()} has been confirmed.${status.provider_reference ? ` Receipt: ${status.provider_reference}.` : ''}`, 'success');
        sessionStorage.removeItem('agcfPendingDonation');
        submitButton.textContent = 'Donation confirmed';
        return;
      }
      if (['failed', 'cancelled', 'reversed'].includes(status.status)) {
        showMessage(`The payment status is ${status.status}. If money was deducted, please contact the foundation before trying again.`, 'error');
        submitButton.disabled = false;
        submitButton.textContent = 'Try another donation';
        return;
      }
    } catch { /* transient polling failure; try again */ }
  }
  showMessage('We have not received confirmation yet. This does not mean the payment failed. Refresh this page later or contact the foundation if money was deducted.', '');
  submitButton.disabled = false;
  submitButton.textContent = 'Check again / make another donation';
}

async function handleReturnFromCard() {
  const params = new URLSearchParams(window.location.search);
  const donationId = params.get('donationId');
  const trackingId = params.get('OrderTrackingId');
  const payment = params.get('payment');
  if (!donationId || payment !== 'card') return;
  returnStatus.hidden = false;
  returnStatus.textContent = 'Checking your payment with the payment provider…';
  try {
    for (let i = 0; i < 8; i++) {
      const suffix = trackingId ? `?OrderTrackingId=${encodeURIComponent(trackingId)}` : '';
      const status = await apiRequest(`/api/donations/${encodeURIComponent(donationId)}/status${suffix}`);
      if (status.status === 'paid') {
        returnStatus.textContent = `Thank you. Your donation of KSh ${Number(status.amount_kes).toLocaleString()} has been verified.${status.provider_reference ? ` Reference: ${status.provider_reference}.` : ''}`;
        return;
      }
      if (['failed', 'reversed', 'cancelled'].includes(status.status)) {
        returnStatus.textContent = `The payment provider reports status: ${status.status}. If your account was charged, contact the foundation before retrying.`;
        return;
      }
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
    returnStatus.textContent = 'Your payment is still awaiting confirmation. Please check again shortly. Do not make another payment unless you confirm the first attempt did not succeed.';
  } catch (error) {
    returnStatus.textContent = `We could not verify the payment right now. Please try again later. ${error.message}`;
  }
}

handleReturnFromCard();
const pending = sessionStorage.getItem('agcfPendingDonation');
if (pending && !new URLSearchParams(location.search).has('donationId')) {
  showMessage('A previous M-Pesa donation may still be processing. Please avoid submitting it again if you have already entered your PIN.', '');
}
