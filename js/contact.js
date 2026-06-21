// js/contact.js
// Handles form validation and sending data to our Node.js backend

async function submitForm() {

  // Step 1: Clear any previous error messages
  clearErrors();

  // Step 2: Read values from each input field
  const name    = document.getElementById('name').value.trim();
  const email   = document.getElementById('email').value.trim();
  const phone   = document.getElementById('phone').value.trim();
  const subject = document.getElementById('subject').value;
  const message = document.getElementById('message').value.trim();

  // Step 3: Validate — check each required field
  let hasError = false;

  if (!name) {
    showError('nameErr', 'Please enter your name.');
    hasError = true;
  }

  if (!email) {
    showError('emailErr', 'Please enter your email.');
    hasError = true;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    // Regex checks: something @ something . something
    showError('emailErr', 'Please enter a valid email address.');
    hasError = true;
  }

  if (!subject) {
    showError('subjectErr', 'Please select a subject.');
    hasError = true;
  }

  if (!message || message.length < 10) {
    showError('messageErr', 'Please write at least 10 characters.');
    hasError = true;
  }

  // Step 4: If any field is invalid, stop here
  if (hasError) return;

  // Step 5: Disable the button and show loading state
  const btn = document.getElementById('submitBtn');
  btn.disabled    = true;
  btn.textContent = 'Sending…';

  // Step 6: Package data as an object to send
  const payload = { name, email, phone, subject, message };

  // Step 7: Send data to our backend API
  try {
    const response = await fetch('/api/contact', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload)
      // JSON.stringify turns { name: "John" } into '{"name":"John"}'
    });

    const result = await response.json(); // parse the response

    if (result.success) {
      // Step 8a: Show success — hide form, show thank-you message
      document.getElementById('formWrap').style.display  = 'none';
      document.getElementById('successMsg').style.display = 'flex';
    } else {
      // Step 8b: Server returned an error message
      showBannerError(result.message || 'Something went wrong.');
      btn.disabled    = false;
      btn.textContent = 'Send Message';
    }

  } catch (err) {
    // Step 8c: Network error (server not running etc.)
    showBannerError('Could not reach the server. Is it running?');
    btn.disabled    = false;
    btn.textContent = 'Send Message';
  }
}

// Helper: show a red error under a specific field
function showError(fieldId, message) {
  const el = document.getElementById(fieldId);
  el.textContent = message;
  el.classList.add('show');
}

// Helper: clear all field errors
function clearErrors() {
  ['nameErr', 'emailErr', 'subjectErr', 'messageErr'].forEach(id => {
    const el = document.getElementById(id);
    el.textContent = '';
    el.classList.remove('show');
  });
  document.getElementById('errorMsg').style.display = 'none';
}

// Helper: show the red banner at the top of the form
function showBannerError(msg) {
  document.getElementById('errorText').textContent = msg;
  document.getElementById('errorMsg').style.display = 'flex';
}