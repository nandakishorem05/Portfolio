// js/contact.js – EmailJS client-side contact form handler
(() => {
  const form = document.getElementById('contact-form');
  const submitBtn = form.querySelector('button[type="submit"]');

  // 👉 Replace these with your real EmailJS credentials at emailjs.com
  const SERVICE_ID  = 'YOUR_SERVICE_ID';
  const TEMPLATE_ID = 'YOUR_TEMPLATE_ID';
  const PUBLIC_KEY  = 'YOUR_PUBLIC_KEY';

  const showToast = (msg, success = true) => {
    const existing = document.getElementById('toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'toast';
    toast.textContent = msg;
    toast.style.cssText = `
      position: fixed; bottom: 2rem; right: 2rem;
      background: ${success ? '#244855' : '#E64833'};
      color: #FBE9D0; padding: 1rem 1.5rem;
      border-radius: 10px; font-family: 'DM Sans', sans-serif;
      font-size: 0.95rem; font-weight: 600;
      box-shadow: 4px 4px 0 #874F41;
      z-index: 9999; animation: fadeIn 0.3s ease;
      max-width: 320px;
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
  };

  form.addEventListener('submit', async e => {
    e.preventDefault();

    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending…';
    submitBtn.disabled = true;

    const payload = {
      service_id:    SERVICE_ID,
      template_id:   TEMPLATE_ID,
      user_id:       PUBLIC_KEY,
      template_params: {
        from_name:  form.elements['name'].value,
        from_email: form.elements['email'].value,
        subject:    form.elements['subject'].value,
        message:    form.elements['message'].value
      }
    };

    try {
      const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error(`EmailJS ${res.status}`);
      showToast('✅ Message sent! I\'ll get back to you soon.');
      form.reset();
    } catch (err) {
      console.error(err);
      showToast('❌ Failed to send. Please try again or email me directly.', false);
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });
})();
