/* ============================================================
   Edge Camouflage — Layout Templates
   Injects nav + footer + mobile menu into each page
   ============================================================ */

(function () {
  'use strict';

  const LOGO_SVG = `
    <svg viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polygon points="19,2 34,10 34,28 19,36 4,28 4,10" fill="#0f1310" stroke="#2a2e27" stroke-width="1"/>
      <polygon points="19,2 27,6 26,14 19,12 12,14 11,6"  fill="#1a2e1c" opacity="0.9"/>
      <polygon points="4,10 12,14 11,22 4,20"             fill="#162818" opacity="0.9"/>
      <polygon points="34,10 26,14 27,22 34,20"           fill="#1e3020" opacity="0.8"/>
      <polygon points="4,28 11,22 19,26 12,34"            fill="#142216" opacity="0.9"/>
      <polygon points="34,28 27,22 19,26 26,34"           fill="#1a2a1a" opacity="0.8"/>
      <polygon points="19,26 11,22 12,14 19,12 26,14 27,22" fill="#0d1a0f" opacity="0.9"/>
      <text x="10" y="23" font-family="Syne, sans-serif" font-weight="800" font-size="11" fill="#4dff91" letter-spacing="-1">EC</text>
      <line x1="19" y1="2" x2="19" y2="7" stroke="#4dff91" stroke-width="1.5" opacity="0.6"/>
    </svg>`;

  const isPage  = window.location.pathname.includes('/pages/');
  const root    = isPage ? '../' : './';

  const NAV_HTML = `
  <div class="cursor" id="cursor"></div>
  <div class="cursor-ring" id="cursorRing"></div>
  <nav class="nav">
    <a href="${root}index.html" class="nav-logo">
      <div class="nav-logo-mark">${LOGO_SVG}</div>
      <div class="nav-logo-text">
        <span class="nav-logo-name">Edge Camouflage</span>
        <span class="nav-logo-sub">MIT · Adversarial AI</span>
      </div>
    </a>
    <ul class="nav-links">
      <li><a href="${root}pages/research.html">Research</a></li>
      <li><a href="${root}pages/resources.html">Resources</a></li>
      <li><a href="${root}pages/use-cases.html">Use Cases</a></li>
      <li><a href="${root}pages/community.html">Community</a></li>
      <li><a href="${root}pages/about.html">About</a></li>
    </ul>
    <a href="${root}pages/about.html#contact" class="nav-cta nav-cta--desktop">Request Access</a>
    <button class="nav-hamburger" id="navHamburger" aria-label="Open menu" aria-expanded="false">
      <span></span><span></span><span></span>
    </button>
  </nav>
  <div class="nav-drawer" id="navDrawer" aria-hidden="true">
    <ul class="nav-drawer-links">
      <li><a href="${root}pages/research.html">Research</a></li>
      <li><a href="${root}pages/resources.html">Resources</a></li>
      <li><a href="${root}pages/use-cases.html">Use Cases</a></li>
      <li><a href="${root}pages/community.html">Community</a></li>
      <li><a href="${root}pages/about.html">About</a></li>
    </ul>
    <a href="${root}pages/about.html#contact" class="nav-drawer-cta">Request Access</a>
  </div>`;

  const MIT_STRIPE_HTML = `
  <div class="mit-stripe">
    <span class="mit-stripe-label">Rooted at MIT</span>
    <div class="mit-stripe-divider"></div>
    <div class="mit-stripe-tags">
      <span class="mit-stripe-tag">CSAIL Affiliated</span>
      <span class="mit-stripe-tag">DARPA Collaboration</span>
      <span class="mit-stripe-tag">Peer-Reviewed Research</span>
      <span class="mit-stripe-tag">Open Source Tooling</span>
      <span class="mit-stripe-tag">Red Team Certified</span>
    </div>
  </div>`;

  const FOOTER_HTML = `
  <footer class="footer">
    <div class="footer-grid">
      <div class="footer-brand">
        <a href="${root}index.html" class="nav-logo">
          <div class="nav-logo-mark">${LOGO_SVG}</div>
          <div class="nav-logo-text">
            <span class="nav-logo-name">Edge Camouflage</span>
            <span class="nav-logo-sub">MIT · Adversarial AI</span>
          </div>
        </a>
        <p>Adversarial attack research rooted at MIT CSAIL. Building open infrastructure for trustworthy, robust AI systems.</p>
        <div class="mit-badge"><span class="dot-red">◆</span> MIT CSAIL Affiliated · Cambridge, MA</div>
      </div>
      <div class="footer-col">
        <h4>Platform</h4>
        <ul>
          <li><a href="${root}pages/resources.html">Attack Library</a></li>
          <li><a href="${root}pages/resources.html#toolkits">Red Team Suite</a></li>
          <li><a href="${root}pages/resources.html#api">API Reference</a></li>
          <li><a href="${root}pages/resources.html#quickstart">Python SDK</a></li>
          <li><a href="${root}pages/resources.html#quickstart">JS/TS SDK</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Research</h4>
        <ul>
          <li><a href="${root}pages/research.html">Papers</a></li>
          <li><a href="${root}pages/research.html#datasets">Datasets</a></li>
          <li><a href="${root}pages/research.html#areas">Research Areas</a></li>
          <li><a href="${root}pages/community.html">Research Blog</a></li>
          <li><a href="${root}pages/research.html">Lab Publications</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Company</h4>
        <ul>
          <li><a href="${root}pages/about.html">About</a></li>
          <li><a href="${root}pages/about.html#team">Team</a></li>
          <li><a href="${root}pages/about.html#mit">MIT Partnership</a></li>
          <li><a href="${root}pages/about.html#ethics">Ethics Policy</a></li>
          <li><a href="${root}pages/about.html#contact">Contact</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© 2025 Edge Camouflage Inc. · MIT CSAIL Partnership · Cambridge, MA 02139</span>
      <div class="footer-bottom-links">
        <a href="#">Privacy</a>
        <a href="#">Terms</a>
        <a href="#">Responsible Disclosure</a>
      </div>
    </div>
  </footer>`;

  document.addEventListener('DOMContentLoaded', () => {
    const navMount    = document.getElementById('nav-mount');
    const mitMount    = document.getElementById('mit-stripe-mount');
    const footerMount = document.getElementById('footer-mount');

    if (navMount)    navMount.innerHTML    = NAV_HTML;
    if (mitMount)    mitMount.innerHTML    = MIT_STRIPE_HTML;
    if (footerMount) footerMount.innerHTML = FOOTER_HTML;

    // Hamburger toggle
    const hamburger = document.getElementById('navHamburger');
    const drawer    = document.getElementById('navDrawer');
    if (hamburger && drawer) {
      hamburger.addEventListener('click', () => {
        const open = drawer.classList.toggle('open');
        hamburger.classList.toggle('open', open);
        hamburger.setAttribute('aria-expanded', open);
        drawer.setAttribute('aria-hidden', !open);
      });
      // Close on drawer link click
      drawer.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
          drawer.classList.remove('open');
          hamburger.classList.remove('open');
          hamburger.setAttribute('aria-expanded', 'false');
          drawer.setAttribute('aria-hidden', 'true');
        });
      });
    }
  });
})();
