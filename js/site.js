// Tufts Electric Racing — site behaviours (no dependencies)
(function () {
  'use strict';
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var MENU = '<svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M4 7h16"></path><path d="M4 12h16"></path><path d="M4 17h16"></path></svg>';
  var CLOSE = '<svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12"></path><path d="M18 6L6 18"></path></svg>';

  // ---------- Mobile menu (full-screen overlay) ----------
  var toggle = document.querySelector('.nav-toggle');
  var menu = document.getElementById('site-menu');
  function setMenu(open) {
    if (!toggle || !menu) return;
    menu.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    toggle.innerHTML = open ? CLOSE : MENU;
    document.body.style.overflow = open ? 'hidden' : '';
  }
  if (toggle && menu) {
    toggle.addEventListener('click', function () { setMenu(!menu.classList.contains('open')); });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
    window.addEventListener('resize', function () { if (window.innerWidth > 820) setMenu(false); });
  }

  // ---------- Reveal on scroll ----------
  var revealEls = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  revealEls.forEach(function (el) {
    var d = parseInt(el.getAttribute('data-d') || '0', 10);
    el.style.transitionDelay = d + 'ms';
  });
  function showAll() { revealEls.forEach(function (el) { el.classList.add('in'); }); }
  if (!('IntersectionObserver' in window) || reduced) {
    showAll();
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealEls.forEach(function (el) { io.observe(el); });
    // Safety net for elements the observer's margin never reaches (e.g. the last rows at the
    // very bottom of the page): anything inside the viewport is shown on scroll.
    var pending = revealEls.slice();
    var sweeping = false;
    function sweep() {
      sweeping = false;
      var vh = window.innerHeight;
      pending = pending.filter(function (el) {
        if (el.classList.contains('in')) return false;
        var r = el.getBoundingClientRect();
        if (r.top < vh - 24 && r.bottom > 0) { el.classList.add('in'); return false; }
        return true;
      });
    }
    window.addEventListener('scroll', function () { if (!sweeping && pending.length) { sweeping = true; requestAnimationFrame(sweep); } }, { passive: true });
    setTimeout(sweep, 1200);
  }

  // ---------- Partners marquee ----------
  document.querySelectorAll('ul[data-marquee]').forEach(function (ul) {
    var items = Array.prototype.slice.call(ul.children);
    var cta = null;
    items.forEach(function (li) { if (li.querySelector('a')) cta = li; });
    if (cta) ul.removeChild(cta);
    if (ul.children.length < 3) return;
    var wrap = document.createElement('div');
    wrap.className = 'marquee';
    ul.parentNode.insertBefore(wrap, ul);
    wrap.appendChild(ul);
    ul.classList.add('marquee-track');
    ul.setAttribute('aria-label', 'Our partners');
    var originals = Array.prototype.slice.call(ul.children);
    originals.forEach(function (li) {
      var clone = li.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      ul.appendChild(clone);
    });
    // Slow down or speed up with the number of logos so the pace feels constant.
    ul.style.animationDuration = Math.max(24, originals.length * 5) + 's';
    if (cta) {
      var a = cta.querySelector('a');
      a.style.flex = 'none';
      a.style.minHeight = '52px';
      a.style.padding = '0 26px';
      var holder = document.createElement('div');
      holder.className = 'marquee-cta';
      holder.appendChild(a);
      wrap.parentNode.insertBefore(holder, wrap.nextSibling);
    }
  });

  // ---------- Counters ----------
  function animateNumber(el, to, prefix, suffix) {
    var duration = reduced ? 0 : 1400;
    var start = null;
    function frame(ts) {
      if (start === null) start = ts;
      var t = duration ? Math.min(1, (ts - start) / duration) : 1;
      var eased = 1 - Math.pow(1 - t, 3);
      el.textContent = prefix + Math.round(to * eased) + suffix;
      if (t < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
  var counters = Array.prototype.slice.call(document.querySelectorAll('[data-count], [data-days-to]'));
  counters.forEach(function (el) {
    var to, prefix = el.getAttribute('data-prefix') || '', suffix = el.getAttribute('data-suffix') || '';
    if (el.hasAttribute('data-days-to')) {
      var target = new Date(el.getAttribute('data-days-to') + 'T12:00:00-04:00').getTime();
      to = Math.max(0, Math.ceil((target - Date.now()) / 86400000));
    } else {
      to = parseInt(el.getAttribute('data-count'), 10);
    }
    el.setAttribute('aria-label', prefix + to + suffix);
    if (!('IntersectionObserver' in window) || reduced) { el.textContent = prefix + to + suffix; return; }
    el.textContent = prefix + '0' + suffix;
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { animateNumber(el, to, prefix, suffix); cio.disconnect(); }
      });
    }, { threshold: 0.6 });
    cio.observe(el);
  });

  // ---------- TER27 scroll scene ----------
  var scene = document.querySelector('.scene');
  if (scene && !reduced) {
    var ticking = false;
    function update() {
      ticking = false;
      var r = scene.getBoundingClientRect();
      var vh = window.innerHeight || 1;
      // 0 when the section's top enters at the bottom of the viewport, 1 when it has risen ~60% of the way up.
      var p = (vh - r.top) / (vh * 0.75);
      p = Math.max(0, Math.min(1, p));
      scene.style.setProperty('--p', p.toFixed(3));
    }
    function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
  } else if (scene) {
    scene.style.setProperty('--p', '1');
  }
})();
