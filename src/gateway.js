import './styles.css';
import { gsap } from 'gsap';
import { initSmoothScroll, parallaxFloats } from './shared.js';

initSmoothScroll();
parallaxFloats();

/* ---------- 3D tilt on cards (layered parallax) ---------- */
const cards = document.querySelectorAll('.card');
const maxTilt = 10;

cards.forEach((card) => {
  const layers = card.querySelectorAll('.layer');

  card.addEventListener('mousemove', (e) => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    const rx = (0.5 - y) * maxTilt;
    const ry = (x - 0.5) * maxTilt;

    gsap.to(card, { rotationX: rx, rotationY: ry, transformPerspective: 1500, duration: 0.45, ease: 'power2.out' });
    card.style.setProperty('--mx', x * 100 + '%');
    card.style.setProperty('--my', y * 100 + '%');

    layers.forEach((l) => {
      const d = parseFloat(l.style.getPropertyValue('--d') || '0');
      gsap.to(l, { x: (x - 0.5) * d, y: (y - 0.5) * d, duration: 0.45, ease: 'power2.out' });
    });
  });

  card.addEventListener('mouseleave', () => {
    gsap.to(card, { rotationX: 0, rotationY: 0, duration: 0.9, ease: 'elastic.out(1,0.5)' });
    layers.forEach((l) =>
      gsap.to(l, { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1,0.5)' })
    );
  });
});

/* ---------- Click transition: zoom + veil + navigate ---------- */
cards.forEach((card) => {
  card.addEventListener('click', (e) => {
    e.preventDefault();
    const dest = card.getAttribute('data-dest');
    const href = card.getAttribute('href');
    const veil = document.getElementById('veil');
    veil.classList.remove('art', 'resort');
    veil.classList.add(dest);

    cards.forEach((c) => {
      if (c === card) return;
      gsap.to(c, { opacity: 0, scale: 0.94, y: 20, duration: 0.55, ease: 'power3.out' });
    });

    const rect = card.getBoundingClientRect();
    const cx = window.innerWidth / 2 - (rect.left + rect.width / 2);
    const cy = window.innerHeight / 2 - (rect.top + rect.height / 2);
    const scale = Math.max(window.innerWidth / rect.width, window.innerHeight / rect.height) * 1.5;

    gsap.to(card, {
      x: cx,
      y: cy,
      scale,
      rotationX: 0,
      rotationY: 0,
      duration: 0.95,
      ease: 'power3.inOut',
      zIndex: 20
    });

    gsap.to(veil, {
      opacity: 1,
      duration: 0.8,
      ease: 'power2.in',
      delay: 0.2,
      onComplete: () => (window.location.href = href)
    });
  });
});

/* ---------- Hero reveal entrance ---------- */
window.addEventListener('load', () => {
  gsap.to('.reveal > span', { y: 0, duration: 1.1, ease: 'power3.out', stagger: 0.12, from: '+=0' });

  gsap.from('.card', {
    y: 80,
    opacity: 0,
    duration: 1.2,
    ease: 'power3.out',
    stagger: 0.15,
    delay: 0.2
  });
});
