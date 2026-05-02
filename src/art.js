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

/* marketplace card scroll reveal */
gsap.utils.toArray('.market-card').forEach((card, i) => {
  gsap.from(card, {
    y: 60,
    opacity: 0,
    duration: 0.9,
    ease: 'power3.out',
    scrollTrigger: { trigger: card, start: 'top 92%', once: true },
    delay: (i % 3) * 0.06
  });
});

/* ---------- CART + CHECKOUT ---------- */
const FLOT_BASE = 'https://pay.flotme.ai/bondumaniart';
const STUDIO_WHATSAPP = '23276403799';
const CART_KEY = 'bondumani_art_cart_v1';
const CUSTOMER_KEY = 'bondumani_art_customer_v1';

let cart = loadCart();
let customer = JSON.parse(localStorage.getItem(CUSTOMER_KEY) || '{}');

function loadCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY) || '[]'); }
  catch { return []; }
}
function saveCart() { localStorage.setItem(CART_KEY, JSON.stringify(cart)); }
function saveCustomer() { localStorage.setItem(CUSTOMER_KEY, JSON.stringify(customer)); }

function cartTotal() { return cart.reduce((s, it) => s + (it.price * it.qty), 0); }
function cartCount() { return cart.reduce((s, it) => s + it.qty, 0); }
function fmt(n) { return '$ ' + Number(n).toLocaleString('en-US'); }

function addToCart(card) {
  const id = card.dataset.id;
  const existing = cart.find(it => it.id === id);
  if (existing) existing.qty += 1;
  else cart.push({
    id,
    title: card.dataset.title,
    medium: card.dataset.medium,
    price: parseFloat(card.dataset.price) || 0,
    num: card.dataset.num,
    image: card.dataset.image,
    qty: 1
  });
  saveCart();
  renderCart(true);
  openCart();
}
function removeItem(id) {
  cart = cart.filter(it => it.id !== id);
  saveCart();
  renderCart();
}
function setQty(id, q) {
  const it = cart.find(c => c.id === id);
  if (!it) return;
  it.qty = Math.max(1, q);
  saveCart();
  renderCart();
}

const drawer = document.getElementById('cart-drawer');
const itemsEl = document.querySelector('[data-cart-items]');
const totalEl = document.querySelector('[data-cart-total]');
const itemsCountEl = document.querySelector('[data-cart-items-count]');
const formEl = document.querySelector('[data-cart-form]');

function renderCart(bump = false) {
  const count = cartCount();
  document.querySelectorAll('[data-cart-count]').forEach(el => {
    el.textContent = count;
    el.classList.toggle('empty', count === 0);
    if (bump && count > 0) {
      el.classList.remove('bump'); void el.offsetWidth;
      el.classList.add('bump');
    }
  });
  if (itemsCountEl) itemsCountEl.textContent = count;
  if (totalEl) totalEl.textContent = fmt(cartTotal());

  if (drawer) drawer.classList.toggle('empty', cart.length === 0);

  if (!itemsEl) return;
  itemsEl.innerHTML = cart.map(it => `
    <li class="cart-item" data-line-id="${it.id}">
      <div class="cart-item-img"><img src="${it.image}" alt="${it.title}"/></div>
      <div class="cart-item-info">
        <div class="num">${it.num} · ${it.medium}</div>
        <div class="ttl">${it.title.replace(/study (\w+)$/i, 'study <em>$1</em>')}.</div>
        <div class="pr">${fmt(it.price)} each</div>
      </div>
      <div class="cart-item-actions">
        <div class="qty-stepper">
          <button class="qty-btn" data-qty="-" aria-label="Decrease">−</button>
          <span class="qty-val">${it.qty}</span>
          <button class="qty-btn" data-qty="+" aria-label="Increase">+</button>
        </div>
        <button class="item-remove" data-remove>remove</button>
      </div>
    </li>
  `).join('');
}

function openCart() {
  drawer && drawer.classList.add('open');
  document.body.classList.add('cart-open');
  drawer && drawer.setAttribute('aria-hidden', 'false');
}
function closeCart() {
  drawer && drawer.classList.remove('open');
  document.body.classList.remove('cart-open');
  drawer && drawer.setAttribute('aria-hidden', 'true');
}

/* prefill customer form from localStorage */
function hydrateForm() {
  if (!formEl) return;
  ['name', 'phone', 'address', 'notes'].forEach(k => {
    if (customer[k] && formEl.elements[k]) formEl.elements[k].value = customer[k];
  });
}

/* event delegation */
document.addEventListener('click', (e) => {
  const addBtn = e.target.closest('[data-add-to-cart]');
  if (addBtn) {
    e.preventDefault();
    const card = addBtn.closest('.market-card');
    if (card) addToCart(card);
    return;
  }
  if (e.target.closest('[data-open-cart]')) { e.preventDefault(); openCart(); return; }
  if (e.target.closest('[data-close-cart]')) { e.preventDefault(); closeCart(); return; }
  if (e.target.closest('[data-close-checkout]')) { e.preventDefault(); closeCheckout(); return; }

  const qty = e.target.closest('[data-qty]');
  if (qty) {
    const li = qty.closest('[data-line-id]');
    const id = li.dataset.lineId;
    const it = cart.find(c => c.id === id);
    if (!it) return;
    setQty(id, it.qty + (qty.dataset.qty === '+' ? 1 : -1));
    return;
  }
  const rm = e.target.closest('[data-remove]');
  if (rm) {
    const li = rm.closest('[data-line-id]');
    if (li) removeItem(li.dataset.lineId);
    return;
  }
  const checkoutBtn = e.target.closest('[data-checkout]');
  if (checkoutBtn) { e.preventDefault(); proceedToCheckout(); return; }
});

document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  if (document.getElementById('checkout-modal')?.classList.contains('open')) closeCheckout();
  else if (drawer?.classList.contains('open')) closeCart();
});

/* persist form values as user types */
formEl && formEl.addEventListener('input', (e) => {
  const t = e.target;
  if (!t.name) return;
  customer[t.name] = t.value;
  saveCustomer();
  t.classList.remove('invalid');
});

/* ---------- CHECKOUT ---------- */
const checkoutModal = document.getElementById('checkout-modal');
const checkoutFrame = document.getElementById('checkout-frame');
const checkoutLoading = document.querySelector('[data-checkout-loading]');
const checkoutTotalEl = document.querySelector('[data-checkout-total]');
const checkoutWa = document.querySelector('[data-checkout-whatsapp]');
const checkoutFallback = document.querySelector('[data-checkout-fallback]');

function buildOrderMessage(total) {
  const lines = [];
  lines.push('Hello Bondumani Art — I would like to place an order.');
  lines.push('');
  lines.push('🎨 ITEMS');
  cart.forEach(it => {
    lines.push(`• ${it.num} — ${it.title} (${it.medium}) × ${it.qty} = $ ${(it.price * it.qty).toLocaleString('en-US')}`);
  });
  lines.push('');
  lines.push(`💳 TOTAL: $ ${total.toLocaleString('en-US')}`);
  lines.push('');
  lines.push('📦 DELIVERY');
  lines.push(`Name: ${customer.name || ''}`);
  lines.push(`Phone: ${customer.phone || ''}`);
  lines.push(`Address: ${customer.address || ''}`);
  if (customer.notes) lines.push(`Notes: ${customer.notes}`);
  lines.push('');
  lines.push('Payment will be completed via the Flot checkout link on the website.');
  return lines.join('\n');
}

function validateForm() {
  if (!formEl) return false;
  let valid = true;
  ['name', 'phone', 'address'].forEach(k => {
    const f = formEl.elements[k];
    if (!f) return;
    const ok = f.value && f.value.trim().length > 1;
    f.classList.toggle('invalid', !ok);
    if (!ok && valid) f.focus();
    valid = valid && ok;
  });
  return valid;
}

function openCheckout(amount) {
  if (!checkoutModal || !checkoutFrame) return;
  const url = `${FLOT_BASE}?amount=${encodeURIComponent(amount)}`;
  checkoutLoading?.classList.remove('hide');
  checkoutFrame.src = url;
  if (checkoutFallback) checkoutFallback.href = url;
  if (checkoutTotalEl) checkoutTotalEl.textContent = fmt(amount);
  checkoutModal.classList.add('open');
  checkoutModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('checkout-open');
}
function closeCheckout() {
  if (!checkoutModal || !checkoutFrame) return;
  checkoutModal.classList.remove('open');
  checkoutModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('checkout-open');
  // small delay so the closing animation can complete before unloading
  setTimeout(() => { checkoutFrame.src = 'about:blank'; }, 350);
}
checkoutFrame && checkoutFrame.addEventListener('load', () => {
  // hide loading after first non-blank load
  if (checkoutFrame.src && checkoutFrame.src !== 'about:blank') {
    setTimeout(() => checkoutLoading?.classList.add('hide'), 300);
  }
});

function proceedToCheckout() {
  if (cart.length === 0) {
    openCart();
    return;
  }
  if (!validateForm()) return;

  const total = cartTotal();
  const message = buildOrderMessage(total);
  const waUrl = `https://wa.me/${STUDIO_WHATSAPP}?text=${encodeURIComponent(message)}`;
  if (checkoutWa) checkoutWa.href = waUrl;

  // close cart drawer first, then open Flot modal
  closeCart();
  setTimeout(() => openCheckout(total), 250);
}

/* init */
hydrateForm();
renderCart();

/* founder cards rise */
gsap.from('article', {
  y: 60,
  opacity: 0,
  duration: 1,
  stagger: 0.15,
  ease: 'power3.out',
  scrollTrigger: { trigger: '#founders', start: 'top 70%', once: true }
});
