document.addEventListener('DOMContentLoaded', function() {

  var hamburger = document.getElementById('hamburger');
  var sidebar   = document.getElementById('sidebar');
  var overlay   = document.getElementById('sidebarOverlay');

  if (hamburger && sidebar) {
    hamburger.addEventListener('click', function() {
      var isOpen = sidebar.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
      if (overlay) overlay.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    if (overlay) {
      overlay.addEventListener('click', function() {
        sidebar.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        overlay.classList.remove('open');
        document.body.style.overflow = '';
      });
    }

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        sidebar.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        if (overlay) overlay.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  var tabBtns   = document.querySelectorAll('.tab-btn');
  var tabPanels = document.querySelectorAll('.tab-panel');

  tabBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      tabBtns.forEach(function(b)   { b.classList.remove('active'); });
      tabPanels.forEach(function(p) { p.classList.remove('active'); });
      btn.classList.add('active');
      var target = document.getElementById(btn.getAttribute('data-tab'));
      if (target) target.classList.add('active');
    });
  });

  var faqBtns = document.querySelectorAll('.faq-btn');

  faqBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      var item   = btn.closest('.faq-item');
      var isOpen = item.classList.contains('open');

      document.querySelectorAll('.faq-item.open').forEach(function(openItem) {
        openItem.classList.remove('open');
        openItem.querySelector('.faq-btn').setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  var form = document.getElementById('bookingForm');

  if (form) {

    var dateField = document.getElementById('date');
    if (dateField) {
      var today = new Date().toISOString().split('T')[0];
      dateField.setAttribute('min', today);
    }

    function checkField(field) {
      var value  = field.value.trim();
      var id     = field.id;
      var errBox = document.getElementById(id + 'Err');
      var msg    = '';

      if (field.hasAttribute('required') && value === '') {
        msg = 'This field is required.';
      }

      if (!msg && id === 'email' && value !== '') {
        var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        if (!emailOk) msg = 'Please enter a valid email address.';
      }

      if (!msg && id === 'phone' && value !== '') {
        var phoneOk = /^[\d\s\+\-\(\)]{7,15}$/.test(value);
        if (!phoneOk) msg = 'Please enter a valid phone number.';
      }

      if (!msg && id === 'date' && value !== '') {
        var chosen = new Date(value);
        var now    = new Date();
        now.setHours(0, 0, 0, 0);
        if (chosen < now) msg = 'Please choose a date in the future.';
      }

      if (!msg && id === 'visitors' && value !== '') {
        var n = parseInt(value, 10);
        if (isNaN(n) || n < 1 || n > 20) msg = 'Please enter a number between 1 and 20.';
      }

      if (msg) {
        field.classList.add('is-error');
        if (errBox) { errBox.textContent = msg; errBox.classList.add('show'); }
        return false;
      } else {
        field.classList.remove('is-error');
        if (errBox) errBox.classList.remove('show');
        return true;
      }
    }

    form.querySelectorAll('.form-control').forEach(function(field) {
      field.addEventListener('blur', function() { checkField(field); });
    });

    form.addEventListener('submit', function(e) {
      e.preventDefault();

      var allOk = true;

      form.querySelectorAll('.form-control').forEach(function(field) {
        if (!checkField(field)) allOk = false;
      });

      if (allOk) {
        var successBox = document.getElementById('successBox');
        var submitBtn  = document.getElementById('submitBtn');
        if (successBox) successBox.classList.add('show');
        if (submitBtn)  { submitBtn.textContent = 'Booking Sent!'; submitBtn.disabled = true; }
        form.reset();
      } else {
        var firstErr = form.querySelector('.is-error');
        if (firstErr) firstErr.focus();
      }
    });

  }

});
