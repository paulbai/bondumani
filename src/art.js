import './styles.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  initSmoothScroll,
  revealLines,
  parallaxFloats,
  tiltTiles,
  introVeil
} from './shared.js';

gsap.registerPlugin(ScrollTrigger);

initSmoothScroll();
introVeil('intro');
revealLines();
parallaxFloats();
tiltTiles('.tile', 4);

/* marquee parallax on scroll */
gsap.utils.toArray('.marquee').forEach((m) => {
  gsap.to(m, {
    xPercent: -5,
    ease: 'none',
    scrollTrigger: { trigger: m, scrub: 1.5, start: 'top bottom', end: 'bottom top' }
  });
});

/* hero mega headline depth wiggle */
gsap.to('#hero-title', {
  letterSpacing: '-0.065em',
  ease: 'none',
  scrollTrigger: { trigger: '#hero-title', scrub: true, start: 'top top', end: 'bottom top' }
});

/* gallery scroll reveal */
gsap.utils.toArray('.art-img').forEach((img, i) => {
  gsap.from(img, {
    y: 80,
    opacity: 0,
    duration: 1.1,
    ease: 'power3.out',
    scrollTrigger: { trigger: img, start: 'top 90%', once: true },
    delay: (i % 3) * 0.05
  });
});

/* founder cards rise */
gsap.from('article', {
  y: 60,
  opacity: 0,
  duration: 1,
  stagger: 0.15,
  ease: 'power3.out',
  scrollTrigger: { trigger: '#founders', start: 'top 70%', once: true }
});
