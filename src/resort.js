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
tiltTiles('.tile', 3);

/* marquee scroll drift */
gsap.utils.toArray('.marquee').forEach((m) => {
  gsap.to(m, {
    xPercent: -4,
    ease: 'none',
    scrollTrigger: { trigger: m, scrub: 1.5, start: 'top bottom', end: 'bottom top' }
  });
});

/* nature-img gentle rise */
gsap.utils.toArray('.nature-img').forEach((img) => {
  gsap.from(img, {
    y: 60,
    opacity: 0,
    duration: 1.1,
    ease: 'power3.out',
    scrollTrigger: { trigger: img, start: 'top 90%', once: true }
  });
});

/* stats count-up feel */
gsap.from('.stat', {
  y: 40,
  opacity: 0,
  stagger: 0.1,
  duration: 0.9,
  ease: 'power3.out',
  scrollTrigger: { trigger: '.stat', start: 'top 80%', once: true }
});
