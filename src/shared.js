import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initSmoothScroll() {
  // Only run Lenis on non-touch (desktop) devices — mobile uses native scroll
  const isTouch =
    typeof window !== 'undefined' &&
    ('ontouchstart' in window || navigator.maxTouchPoints > 0);
  if (isTouch) return null;

  const lenis = new Lenis({
    duration: 1.15,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    smoothTouch: false
  });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  return lenis;
}

export function revealLines(delay = 0.2) {
  document.querySelectorAll('.reveal-wrap').forEach((w, i) => {
    setTimeout(() => w.classList.add('in'), (delay + i * 0.12) * 1000);
  });
}

export function parallaxFloats() {
  document.addEventListener('mousemove', (e) => {
    const x = e.clientX / window.innerWidth - 0.5;
    const y = e.clientY / window.innerHeight - 0.5;
    document.querySelectorAll('.float').forEach((el, i) => {
      el.style.translate = `${x * 10 * (i + 1)}px ${y * 8 * (i + 1)}px`;
    });
  });
}

export function tiltTiles(selector = '.tile', max = 4) {
  document.querySelectorAll(selector).forEach((tile) => {
    tile.addEventListener('mousemove', (e) => {
      const r = tile.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      tile.style.transform = `rotateX(${(0.5 - y) * max}deg) rotateY(${(x - 0.5) * max}deg)`;
    });
    tile.addEventListener('mouseleave', () => {
      tile.style.transform = '';
    });
  });
}

export function scrollReveal() {
  gsap.utils.toArray('[data-reveal]').forEach((el) => {
    gsap.from(el, {
      y: 60,
      opacity: 0,
      duration: 1.1,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 85%', once: true }
    });
  });
}

export function introVeil(id = 'intro') {
  const veil = document.getElementById(id);
  if (!veil) return;
  window.addEventListener('load', () => {
    gsap.to(veil, { opacity: 0, duration: 0.75, ease: 'power3.out', onComplete: () => veil.remove() });
  });
}
