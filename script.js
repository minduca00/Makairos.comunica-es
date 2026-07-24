/* =================================================================
   MAKAIROS COMUNICAÇÕES — script.js
   JavaScript puro (ES6+), sem dependências externas.
   Funcionalidades:
     1. Navbar transparente -> sólida ao rolar
     2. Menu mobile (hamburger)
     3. Scroll reveal (fade in + slide up) via IntersectionObserver
     4. Contadores animados
     5. Efeito ripple nos botões
     6. Ano atual no rodapé
================================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------------------------------------------------------------
     1. NAVBAR: transparente no topo, sólida ao rolar
  --------------------------------------------------------------- */
  const navbar = document.getElementById('navbar');
  const SCROLL_THRESHOLD = 40;

  const updateNavbarState = () => {
    if (window.scrollY > SCROLL_THRESHOLD) {
      navbar.classList.add('navbar--scrolled');
    } else {
      navbar.classList.remove('navbar--scrolled');
    }
  };
  updateNavbarState();
  window.addEventListener('scroll', updateNavbarState, { passive: true });

  /* ---------------------------------------------------------------
     2. MENU MOBILE
  --------------------------------------------------------------- */
  const navToggle = document.getElementById('navbar-toggle');
  const navMenu = document.getElementById('navbar-nav');

  const closeMobileMenu = () => {
    navMenu.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Abrir menu');
  };

  const toggleMobileMenu = () => {
    const isOpen = navMenu.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
    navToggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
  };

  navToggle.addEventListener('click', toggleMobileMenu);

  // Fecha o menu ao clicar em qualquer link de navegação
  navMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMobileMenu);
  });

  // Fecha o menu automaticamente se a tela for redimensionada para desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 860) closeMobileMenu();
  });

  /* ---------------------------------------------------------------
     3. SCROLL REVEAL (fade in + slide up)
     - Elementos dentro do hero aparecem imediatamente ao carregar
       a página (com um pequeno atraso escalonado).
     - Os demais elementos aparecem conforme entram na viewport.
  --------------------------------------------------------------- */
  const revealEls = document.querySelectorAll('[data-reveal]');

  const heroEls = document.querySelectorAll('.hero [data-reveal]');
  heroEls.forEach((el, index) => {
    setTimeout(() => el.classList.add('is-visible'), 150 + index * 120);
  });

  const otherEls = Array.from(revealEls).filter((el) => !el.closest('.hero'));

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  otherEls.forEach((el) => revealObserver.observe(el));

  /* ---------------------------------------------------------------
     4. CONTADORES ANIMADOS
     Ativa quando o elemento entra na tela; anima de 0 até o valor
     definido em data-target, respeitando um sufixo opcional (ex: %).
  --------------------------------------------------------------- */
  const counters = document.querySelectorAll('[data-counter]');

  const animateCounter = (el) => {
    const target = parseFloat(el.getAttribute('data-target')) || 0;
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1600; // ms
    const startTime = performance.now();

    const step = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      // Easing suave (ease-out cúbico) para a contagem não parecer robótica
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(target * eased);
      el.textContent = current + suffix;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target + suffix;
      }
    };

    requestAnimationFrame(step);
  };

  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach((el) => counterObserver.observe(el));

  /* ---------------------------------------------------------------
     5. EFEITO RIPPLE NOS BOTÕES
  --------------------------------------------------------------- */
  const buttons = document.querySelectorAll('.btn');

  buttons.forEach((btn) => {
    btn.addEventListener('click', function (event) {
      const rect = btn.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size = Math.max(rect.width, rect.height);

      ripple.className = 'ripple';
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${event.clientY - rect.top - size / 2}px`;

      btn.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  });

  /* ---------------------------------------------------------------
     6. ANO ATUAL NO RODAPÉ
  --------------------------------------------------------------- */
  const yearEl = document.getElementById('current-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});