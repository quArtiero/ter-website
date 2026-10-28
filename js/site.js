// Tufts Electric Racing — small site behaviours
(function () {
  // Mobile menu
  var toggle = document.querySelector('.nav-toggle');
  var menu = document.getElementById('site-menu');
  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
  }
  // Days until the next competition (dates on FSAE Online are tentative)
  document.querySelectorAll('[data-days-to]').forEach(function (el) {
    var target = new Date(el.getAttribute('data-days-to') + 'T12:00:00-04:00').getTime();
    var days = Math.max(0, Math.ceil((target - Date.now()) / 86400000));
    el.textContent = String(days);
  });
})();
