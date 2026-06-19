// js/contact.js – Contact form handler using Formsubmit.co
// Sends messages directly to nandakishorem05@gmail.com (no API key needed)
(() => {
  const form = document.getElementById('contact-form');
  if (!form) return;
  const submitBtn = form.querySelector('button[type="submit"]');

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
      max-width: 360px;
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 5000);
  };

  form.addEventListener('submit', async e => {
    e.preventDefault();

    // Basic validation
    const name = form.elements['name'].value.trim();
    const email = form.elements['email'].value.trim();
    const subject = form.elements['subject'].value.trim();
    const message = form.elements['message'].value.trim();

    if (!name || !email || !subject || !message) {
      showToast('❌ Please fill in all fields.', false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showToast('❌ Please enter a valid email address.', false);
      return;
    }

    const originalHTML = submitBtn.innerHTML;
    submitBtn.innerHTML = 'Sending… ✈️';
    submitBtn.disabled = true;

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('subject', subject);
      formData.append('message', message);
      formData.append('_subject', `Portfolio Contact: ${subject}`);
      formData.append('_captcha', 'false');
      formData.append('_template', 'table');

      const res = await fetch('https://formsubmit.co/ajax/nandakishorem05@gmail.com', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();

      if (data.success) {
        showToast('✅ Message sent! I\'ll get back to you soon.');
        form.reset();
      } else {
        throw new Error('Form submission failed');
      }
    } catch (err) {
      console.error(err);
      showToast('❌ Failed to send. Please email me directly at nandakishorem05@gmail.com', false);
    } finally {
      submitBtn.innerHTML = originalHTML;
      submitBtn.disabled = false;
    }
  });
})();
