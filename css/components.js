/* ============================================================
   Edge Camouflage — Shared Components JS
   Included on every page
   ============================================================ */

(function () {
  'use strict';

  /* ── Custom Cursor ───────────────────────────────────── */
  function initCursor() {
    const dot  = document.getElementById('cursor');
    const ring = document.getElementById('cursorRing');
    if (!dot || !ring) return;

    let mx = 0, my = 0, rx = 0, ry = 0;

    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      dot.style.left  = mx + 'px';
      dot.style.top   = my + 'px';
    });

    (function loop() {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      ring.style.left = rx + 'px';
      ring.style.top  = ry + 'px';
      requestAnimationFrame(loop);
    })();

    document.querySelectorAll('a, button').forEach(el => {
      el.addEventListener('mouseenter', () => { dot.classList.add('large');  ring.classList.add('large'); });
      el.addEventListener('mouseleave', () => { dot.classList.remove('large'); ring.classList.remove('large'); });
    });
  }

  /* ── Tab Switching ───────────────────────────────────── */
  function initTabs() {
    document.querySelectorAll('.tab-bar').forEach(bar => {
      const btns   = bar.querySelectorAll('.tab-btn');
      const panels = document.querySelectorAll('.tab-panel');

      btns.forEach(btn => {
        btn.addEventListener('click', () => {
          btns.forEach(b => b.classList.remove('active'));
          panels.forEach(p => p.classList.remove('active'));
          btn.classList.add('active');
          const target = document.getElementById('tab-' + btn.dataset.tab);
          if (target) target.classList.add('active');
        });
      });
    });
  }

  /* ── Scroll Reveal ───────────────────────────────────── */
  function initReveal() {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); }
      });
    }, { threshold: 0.08 });

    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
  }

  /* ── Active Nav Link ─────────────────────────────────── */
  function initActiveNav() {
    const current = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(a => {
      const href = a.getAttribute('href');
      if (href && (href === current || (current === 'index.html' && href === './') || href.endsWith(current))) {
        a.classList.add('active');
      }
    });
  }

  /* ── Init All ────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', () => {
    initCursor();
    initTabs();
    initReveal();
    initActiveNav();
  });
})();
