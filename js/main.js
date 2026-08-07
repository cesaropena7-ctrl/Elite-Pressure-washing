/* ==========================================================================
   Elite Pressure Washing — interactions
   ========================================================================== */
(function () {
  'use strict';

  /* ----------------------------------------------------------------------
     1. Image loading
     Elements with data-img get that image as a background. If the file is
     missing the CSS gradient placeholder stays visible, so the layout never
     breaks while you're still gathering photos.
     ---------------------------------------------------------------------- */
  document.querySelectorAll('[data-img]').forEach(function (el) {
    var src = el.getAttribute('data-img');
    if (!src) return;

    var probe = new Image();
    probe.onload = function () {
      el.style.backgroundImage = 'url("' + src + '")';
    };
    probe.src = src;
  });

  /* ----------------------------------------------------------------------
     2. Navigation — border on scroll, hide on scroll down, mobile menu
     ---------------------------------------------------------------------- */
  var nav = document.getElementById('nav');
  var navToggle = document.getElementById('navToggle');
  var navLinks = document.getElementById('navLinks');
  var stickyCta = document.querySelector('.sticky-cta');
  var lastY = 0;

  function onScroll() {
    var y = window.scrollY;

    nav.classList.toggle('scrolled', y > 10);

    // Hide the bar when scrolling down past the hero, show it coming back up.
    if (!navLinks.classList.contains('open')) {
      nav.classList.toggle('hidden', y > 600 && y > lastY);
    }

    // Floating mobile CTA appears once past the hero, hides at the form.
    if (stickyCta) {
      var quote = document.getElementById('quote');
      var atForm = quote && quote.getBoundingClientRect().top < window.innerHeight;
      stickyCta.classList.toggle('show', y > 700 && !atForm);
    }

    lastY = y;
  }

  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      onScroll();
      ticking = false;
    });
  }, { passive: true });

  navToggle.addEventListener('click', function () {
    var open = navLinks.classList.toggle('open');
    navToggle.classList.toggle('open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    nav.classList.remove('hidden');

    // The open menu panel is white, so the bar needs its solid styling even
    // when we're still sitting over the hero.
    if (open) nav.classList.add('scrolled');
    else onScroll();
  });

  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ----------------------------------------------------------------------
     3. Scroll reveal
     ---------------------------------------------------------------------- */
  var revealItems = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    revealItems.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealItems.forEach(function (el) { el.classList.add('visible'); });
  }

  // Hero content should animate immediately rather than waiting on a scroll.
  window.setTimeout(function () {
    document.querySelectorAll('.hero .reveal').forEach(function (el) {
      el.classList.add('visible');
    });
  }, 120);

  /* ----------------------------------------------------------------------
     4. Counting stats
     ---------------------------------------------------------------------- */
  function countUp(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    var duration = 1600;
    var start = null;

    function tick(now) {
      if (start === null) start = now;
      var progress = Math.min((now - start) / duration, 1);
      // ease-out cubic
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target) + (progress === 1 && target >= 500 ? '+' : '');
      if (progress < 1) window.requestAnimationFrame(tick);
    }
    window.requestAnimationFrame(tick);
  }

  var stats = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window && stats.length) {
    var statObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        countUp(entry.target);
        statObserver.unobserve(entry.target);
      });
    }, { threshold: 0.5 });

    stats.forEach(function (el) { statObserver.observe(el); });
  }

  /* ----------------------------------------------------------------------
     5. Before / after slider
     ---------------------------------------------------------------------- */
  var baRange = document.getElementById('baRange');
  var baBefore = document.getElementById('baBefore');
  var baHandle = document.getElementById('baHandle');

  if (baRange && baBefore && baHandle) {
    function setSplit(value) {
      baBefore.style.clipPath = 'inset(0 ' + (100 - value) + '% 0 0)';
      baHandle.style.left = value + '%';
    }
    baRange.addEventListener('input', function () { setSplit(this.value); });
    setSplit(baRange.value);
  }

  /* ----------------------------------------------------------------------
     6. Quote form — Web3Forms submission via fetch
     Keeps the visitor on the page instead of bouncing them to a thank-you
     screen, which is better for conversion tracking and for the visitor.
     ---------------------------------------------------------------------- */
  var form = document.getElementById('quoteForm');
  var result = document.getElementById('formResult');
  var submitBtn = document.getElementById('submitBtn');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var key = form.querySelector('input[name="access_key"]').value;
      if (!key || key === 'YOUR_ACCESS_KEY_HERE') {
        result.textContent = 'Form not configured yet — add your Web3Forms access key.';
        result.className = 'form-result error';
        return;
      }

      submitBtn.classList.add('loading');
      submitBtn.disabled = true;
      result.textContent = '';
      result.className = 'form-result';

      var data = new FormData(form);

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: data
      })
        .then(function (response) { return response.json(); })
        .then(function (json) {
          if (json.success) {
            result.textContent = 'Thanks — your request is in. We’ll be back to you within 24 hours.';
            result.className = 'form-result success';
            form.reset();
          } else {
            throw new Error(json.message || 'Submission failed');
          }
        })
        .catch(function () {
          result.textContent =
            'Something went wrong sending that. Please call us on (609) 335-8822.';
          result.className = 'form-result error';
        })
        .finally(function () {
          submitBtn.classList.remove('loading');
          submitBtn.disabled = false;
          window.setTimeout(function () {
            if (result.classList.contains('success')) {
              result.textContent = '';
              result.className = 'form-result';
            }
          }, 9000);
        });
    });
  }

  /* ----------------------------------------------------------------------
     7. Footer year
     ---------------------------------------------------------------------- */
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

})();
