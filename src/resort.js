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

/* ---------------- BOOKING + FLOT CHECKOUT ---------------- */

const FLOT_BASE = 'https://pay.flotme.ai/bondumaniart';
const STUDIO_WHATSAPP = '23276403799';
const BOOKING_KEY = 'bondumani_booking_v1';

const ROOMS = [
  { id: 'riverfront-large',  name: 'Riverfront large',  rate: 4000, tag: 'suite · 01',  image: '/cabin-murals.jpg' },
  { id: 'riverfront-small',  name: 'Riverfront small',  rate: 3000, tag: 'suite · 02',  image: '/cabin-green.jpg' },
  { id: 'upstairs-double',   name: 'Upstairs double',   rate: 2000, tag: 'double · 03', image: '/cabin-tiedye.jpg' },
  { id: 'downstairs-double', name: 'Downstairs double', rate: 1500, tag: 'double · 04', image: '/cabin-evening.jpg' },
  { id: 'single-cabin',      name: 'Single cabin',      rate: 2500, tag: 'single · 05', image: '/cabin-tiedye-2.jpg' }
];

const EXPERIENCES = [
  { id: 'floating', name: 'Floating lunch & swim', price: 850,  pp: true },
  { id: 'rafting',  name: 'Bamboo rafting',         price: 750,  pp: true },
  { id: 'yoga',     name: 'Yoga & meditation',      price: 1500, pp: true },
  { id: 'picnic',   name: 'Picnic & painting',      price: 2500, pp: false },
  { id: 'spa',      name: 'River spa massage',      price: 1200, pp: false },
  { id: 'lunch',    name: 'Lunch by the river',     price: 700,  pp: true },
  { id: 'bbq',      name: 'Private BBQ',            price: 1500, pp: false },
  { id: 'dinner',   name: 'Private candlelit dinner', price: 1800, pp: false, label: 'couple' },
  { id: 'bath',     name: 'Flower bath',            price: 1500, pp: false }
];

let booking = loadBooking();

function loadBooking() {
  try {
    const stored = JSON.parse(localStorage.getItem(BOOKING_KEY) || '{}');
    return Object.assign({
      roomId: null,
      checkin: '',
      checkout: '',
      guests: 2,
      experiences: [],
      name: '',
      phone: '',
      email: '',
      notes: ''
    }, stored);
  } catch {
    return { roomId: null, checkin: '', checkout: '', guests: 2, experiences: [], name: '', phone: '', email: '', notes: '' };
  }
}
function saveBooking() { localStorage.setItem(BOOKING_KEY, JSON.stringify(booking)); }
function fmt(n) { return 'Le ' + Number(n).toLocaleString('en-US'); }
function todayStr() { return new Date().toISOString().slice(0, 10); }
function addDays(s, n) { const d = new Date(s); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); }
function nightsBetween(a, b) {
  if (!a || !b) return 0;
  const ms = (new Date(b) - new Date(a));
  return Math.max(0, Math.round(ms / 86400000));
}

const drawer = document.getElementById('booking-drawer');
const formEl = document.querySelector('[data-booking-form]');
const roomsListEl = document.querySelector('[data-bk-rooms]');
const expsListEl = document.querySelector('[data-bk-experiences]');
const guestsValEl = document.querySelector('[data-guests-val]');
const summaryEl = document.querySelector('[data-bk-summary]');
const totalEl = document.querySelector('[data-bk-total]');
const nightsEl = document.querySelector('[data-bk-nights]');
const checkinInput = formEl?.elements['checkin'];
const checkoutInput = formEl?.elements['checkout'];

function renderRooms() {
  if (!roomsListEl) return;
  roomsListEl.innerHTML = ROOMS.map(r => `
    <label class="bk-room ${booking.roomId === r.id ? 'selected' : ''}" data-room-id="${r.id}">
      <input type="radio" name="room" value="${r.id}" ${booking.roomId === r.id ? 'checked' : ''}/>
      <div class="bk-room-img"><img src="${r.image}" alt="${r.name}"/></div>
      <div class="bk-room-info">
        <div class="nm">${r.name.replace(/(\w+)$/, '<em>$1</em>')}</div>
        <div class="tg">${r.tag}</div>
      </div>
      <div class="bk-room-rate">${fmt(r.rate)}<br/><small>per night</small></div>
    </label>
  `).join('');
}

function renderExperiences() {
  if (!expsListEl) return;
  expsListEl.innerHTML = EXPERIENCES.map(x => {
    const checked = booking.experiences.includes(x.id);
    const meta = x.pp ? `${fmt(x.price)} per person` : (x.label === 'couple' ? `${fmt(x.price)} per couple` : `${fmt(x.price)} flat`);
    return `
      <label class="bk-exp ${checked ? 'selected' : ''}" data-exp-id="${x.id}">
        <input type="checkbox" name="exp" value="${x.id}" ${checked ? 'checked' : ''}/>
        <div class="bk-exp-info">
          <div class="nm">${x.name}</div>
          <div class="meta">${meta}</div>
        </div>
        <div class="bk-exp-price">${fmt(x.pp ? x.price * Math.max(1, booking.guests) : x.price)}</div>
      </label>
    `;
  }).join('');
}

function renderSummary() {
  const room = ROOMS.find(r => r.id === booking.roomId);
  const nights = nightsBetween(booking.checkin, booking.checkout);
  const roomSubtotal = room && nights > 0 ? room.rate * nights : 0;
  const expsSubtotal = booking.experiences.reduce((s, id) => {
    const x = EXPERIENCES.find(e => e.id === id);
    if (!x) return s;
    return s + (x.pp ? x.price * Math.max(1, booking.guests) : x.price);
  }, 0);
  const total = roomSubtotal + expsSubtotal;

  // build summary lines
  const lines = [];
  if (room) {
    lines.push(`<div class="bk-summary-row"><span>${room.name} × ${nights || 0} ${nights === 1 ? 'night' : 'nights'}</span><span>${fmt(roomSubtotal)}</span></div>`);
  } else {
    lines.push('<div class="bk-summary-row"><span>Choose a room above</span><span></span></div>');
  }
  booking.experiences.forEach(id => {
    const x = EXPERIENCES.find(e => e.id === id);
    if (!x) return;
    const lineAmount = x.pp ? x.price * Math.max(1, booking.guests) : x.price;
    const qtySuffix = x.pp ? ` × ${booking.guests}` : '';
    lines.push(`<div class="bk-summary-row"><span>${x.name}${qtySuffix}</span><span>${fmt(lineAmount)}</span></div>`);
  });
  if (summaryEl) summaryEl.innerHTML = lines.join('');
  if (totalEl) totalEl.textContent = fmt(total);
  if (nightsEl) nightsEl.textContent = nights > 0
    ? `${nights} ${nights === 1 ? 'night' : 'nights'} · ${booking.guests} ${booking.guests === 1 ? 'guest' : 'guests'}`
    : `${booking.guests} ${booking.guests === 1 ? 'guest' : 'guests'}`;

  return total;
}

function render() {
  renderRooms();
  renderExperiences();
  renderSummary();
}

function setMinDates() {
  if (checkinInput) checkinInput.min = todayStr();
  if (checkoutInput) checkoutInput.min = booking.checkin ? addDays(booking.checkin, 1) : addDays(todayStr(), 1);
}

function hydrateForm() {
  if (!formEl) return;
  ['name', 'phone', 'email', 'notes', 'checkin', 'checkout'].forEach(k => {
    if (formEl.elements[k] && booking[k]) formEl.elements[k].value = booking[k];
  });
  if (guestsValEl) guestsValEl.textContent = booking.guests;
  setMinDates();
}

function openBooking(roomId) {
  if (roomId) {
    booking.roomId = roomId;
    saveBooking();
    render();
  }
  drawer && drawer.classList.add('open');
  drawer && drawer.setAttribute('aria-hidden', 'false');
  document.body.classList.add('bk-open');
}
function closeBooking() {
  drawer && drawer.classList.remove('open');
  drawer && drawer.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('bk-open');
}

/* ---------- Flot iframe modal ---------- */
const checkoutModal = document.getElementById('checkout-modal');
const checkoutFrame = document.getElementById('checkout-frame');
const checkoutLoading = document.querySelector('[data-checkout-loading]');
const checkoutTotalEl = document.querySelector('[data-checkout-total]');
const checkoutWa = document.querySelector('[data-checkout-whatsapp]');
const checkoutFallback = document.querySelector('[data-checkout-fallback]');

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
  setTimeout(() => { checkoutFrame.src = 'about:blank'; }, 350);
}
checkoutFrame && checkoutFrame.addEventListener('load', () => {
  if (checkoutFrame.src && checkoutFrame.src !== 'about:blank') {
    setTimeout(() => checkoutLoading?.classList.add('hide'), 300);
  }
});

function buildBookingMessage(total) {
  const room = ROOMS.find(r => r.id === booking.roomId);
  const nights = nightsBetween(booking.checkin, booking.checkout);
  const lines = [];
  lines.push('Hello Bondumani Bamboo Village — I would like to reserve a stay.');
  lines.push('');
  lines.push('🛏️ STAY');
  if (room) lines.push(`Room: ${room.name} (${room.tag}) — ${fmt(room.rate)}/night × ${nights} ${nights === 1 ? 'night' : 'nights'}`);
  lines.push(`Check-in: ${booking.checkin}`);
  lines.push(`Check-out: ${booking.checkout}`);
  lines.push(`Guests: ${booking.guests}`);
  if (booking.experiences.length) {
    lines.push('');
    lines.push('✨ EXPERIENCES');
    booking.experiences.forEach(id => {
      const x = EXPERIENCES.find(e => e.id === id);
      if (!x) return;
      const lineAmount = x.pp ? x.price * Math.max(1, booking.guests) : x.price;
      lines.push(`• ${x.name} — ${fmt(lineAmount)}`);
    });
  }
  lines.push('');
  lines.push(`💳 TOTAL: ${fmt(total)}`);
  lines.push('');
  lines.push('👤 GUEST');
  lines.push(`Name: ${booking.name || ''}`);
  lines.push(`Phone: ${booking.phone || ''}`);
  if (booking.email) lines.push(`Email: ${booking.email}`);
  if (booking.notes) lines.push(`Notes: ${booking.notes}`);
  lines.push('');
  lines.push('Payment will be completed via the Flot checkout link on the website.');
  return lines.join('\n');
}

function validateBooking() {
  let valid = true;
  // room
  if (!booking.roomId) {
    valid = false;
    roomsListEl?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  // dates
  ['checkin', 'checkout'].forEach(k => {
    const f = formEl?.elements[k];
    if (!f) return;
    const ok = !!f.value;
    f.classList.toggle('invalid', !ok);
    if (!ok) valid = false;
  });
  if (booking.checkin && booking.checkout && nightsBetween(booking.checkin, booking.checkout) < 1) {
    formEl?.elements['checkout']?.classList.add('invalid');
    valid = false;
  }
  // contact
  ['name', 'phone'].forEach(k => {
    const f = formEl?.elements[k];
    if (!f) return;
    const ok = f.value && f.value.trim().length > 1;
    f.classList.toggle('invalid', !ok);
    if (!ok) valid = false;
  });
  return valid;
}

function proceedToCheckout() {
  const total = renderSummary();
  if (!validateBooking() || total <= 0) return;
  const message = buildBookingMessage(total);
  const waUrl = `https://wa.me/${STUDIO_WHATSAPP}?text=${encodeURIComponent(message)}`;
  if (checkoutWa) checkoutWa.href = waUrl;
  closeBooking();
  setTimeout(() => openCheckout(total), 250);
}

/* ---------- Event delegation ---------- */
document.addEventListener('click', (e) => {
  // open booking
  const opener = e.target.closest('[data-open-booking],[data-book-room]');
  if (opener) {
    e.preventDefault();
    const roomId = opener.dataset.bookRoom || null;
    openBooking(roomId);
    return;
  }
  if (e.target.closest('[data-close-booking]')) { e.preventDefault(); closeBooking(); return; }
  if (e.target.closest('[data-close-checkout]')) { e.preventDefault(); closeCheckout(); return; }

  // room select
  const roomLabel = e.target.closest('[data-room-id]');
  if (roomLabel) {
    booking.roomId = roomLabel.dataset.roomId;
    saveBooking();
    renderRooms();
    renderSummary();
    return;
  }
  // experience toggle
  const expLabel = e.target.closest('[data-exp-id]');
  if (expLabel) {
    // let the native checkbox handle its own state on click; we sync after
    setTimeout(() => {
      const id = expLabel.dataset.expId;
      const checked = expLabel.querySelector('input').checked;
      if (checked && !booking.experiences.includes(id)) booking.experiences.push(id);
      else if (!checked) booking.experiences = booking.experiences.filter(x => x !== id);
      saveBooking();
      expLabel.classList.toggle('selected', checked);
      renderSummary();
    }, 0);
    return;
  }
  // guests
  const g = e.target.closest('[data-guests]');
  if (g) {
    e.preventDefault();
    const delta = g.dataset.guests === '+' ? 1 : -1;
    booking.guests = Math.max(1, Math.min(8, booking.guests + delta));
    if (guestsValEl) guestsValEl.textContent = booking.guests;
    saveBooking();
    renderExperiences();
    renderSummary();
    return;
  }
  // checkout
  if (e.target.closest('[data-bk-checkout]')) { e.preventDefault(); proceedToCheckout(); return; }
});

document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  if (checkoutModal?.classList.contains('open')) closeCheckout();
  else if (drawer?.classList.contains('open')) closeBooking();
});

/* persist form values + react to date changes */
formEl && formEl.addEventListener('input', (e) => {
  const t = e.target;
  if (!t.name) return;
  if (t.name === 'checkin' || t.name === 'checkout' || t.name === 'name' || t.name === 'phone' || t.name === 'email' || t.name === 'notes') {
    booking[t.name] = t.value;
    saveBooking();
    t.classList.remove('invalid');
    if (t.name === 'checkin') {
      // if checkout earlier than new checkin+1, push it
      if (checkoutInput && (!booking.checkout || new Date(booking.checkout) <= new Date(booking.checkin))) {
        booking.checkout = addDays(booking.checkin, 1);
        checkoutInput.value = booking.checkout;
        saveBooking();
      }
      setMinDates();
    }
    renderSummary();
  }
});

/* init */
hydrateForm();
render();
