// Platform-only motion, modelled on valzazhushi.com:
// one IntersectionObserver for reveals, a smart glass header, light parallax, a custom
// scrollbar and the mobile menu. CSS owns every transition and easing.

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const root = document.documentElement;

/* Reveals ---------------------------------------------------------------- */

const targets = document.querySelectorAll<HTMLElement>('[data-reveal]');
const pending = new Set(targets);
const reveal = (el: HTMLElement) => pending.delete(el) && el.classList.add('is-in');

if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        io.unobserve(e.target);
        reveal(e.target as HTMLElement);
      }
    },
    { rootMargin: '0px 0px -10% 0px' }
  );
  targets.forEach((el) => io.observe(el));
} else {
  targets.forEach(reveal);
}
// Safety net for print and full-page capture, where observers may never fire.
const revealRest = () => pending.forEach(reveal);
const revealAll = () => {
  revealRest();
  document.querySelector('[data-sheet]')?.classList.add('is-open');
};
addEventListener('beforeprint', revealAll);
if (navigator.webdriver) revealAll();

/* Header: glass after the hero, hides on scroll down, returns on scroll up -- */

const header = document.querySelector<HTMLElement>('[data-header]')!;
const hero = document.querySelector<HTMLElement>('[data-hero]');
let solidAt = 8;
let hideFrom = 240;
let lastY = scrollY;
let travel = 0;

function measure() {
  const heroBottom = hero ? hero.getBoundingClientRect().bottom + scrollY : 0;
  solidAt = Math.max(heroBottom - header.offsetHeight, 8);
  hideFrom = Math.max(solidAt + 160, 240);
}

function updateHeader() {
  if (header.classList.contains('is-open')) return;
  const y = scrollY;
  const dy = y - lastY;
  lastY = y;
  if (dy !== 0) travel = Math.sign(dy) === Math.sign(travel) ? travel + dy : dy;
  const atBottom = y + innerHeight >= root.scrollHeight - 2;
  let hidden = header.classList.contains('is-hidden');
  if (y < hideFrom) hidden = false;
  else if (!atBottom && travel > 64) hidden = true;
  else if (travel < -32) hidden = false;
  header.classList.toggle('is-scrolled', y > solidAt);
  header.classList.toggle('is-hidden', hidden);
}

/* Parallax ---------------------------------------------------------------- */

const layers = [...document.querySelectorAll<HTMLElement>('[data-parallax]')];

function updateParallax() {
  if (reduce) return;
  const vh = innerHeight;
  for (const el of layers) {
    const box = el.parentElement!.getBoundingClientRect();
    if (box.bottom < -200 || box.top > vh + 200) continue;
    const factor = Number(el.dataset.parallax) || 0.1;
    const y = (box.top + box.height / 2 - vh / 2) * -factor;
    el.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0) scale(1.08)`;
  }
}

/* Contact sheet: a small box that grows to full size while held on screen, starting near
   mid-screen and ending just before the footer arrives. Its content plays in once it has
   nearly opened. A sheet taller than the screen pins by its bottom edge, so the footer
   never covers the buttons before they have been seen ---------------------------------- */

const sheet = document.querySelector<HTMLElement>('[data-sheet]');

function updateSheet() {
  if (!sheet) return;
  sheet.style.top = `${Math.min(innerHeight - sheet.offsetHeight, 0)}px`;
  if (reduce) return;
  const top = sheet.parentElement!.getBoundingClientRect().top;
  const start = innerHeight * 0.5;
  const travel = sheet.nextElementSibling!.getBoundingClientRect().height;
  const t = Math.min(Math.max((start - top) / (start + travel * 0.8), 0), 1);
  const p = t * t * (3 - 2 * t);
  sheet.style.setProperty('--p', p.toFixed(3));
  if (p >= 0.85) sheet.classList.add('is-open');
}

/* Scrollbar: glass thumb that shows while scrolling --------------------------- */

const track = document.querySelector<HTMLElement>('[data-scrollbar]')!;
const thumb = document.querySelector<HTMLElement>('[data-scrollbar-thumb]')!;
let idle = 0;
let thumbH = 0;
const maxScroll = () => root.scrollHeight - innerHeight;

function updateScrollbar(show = true) {
  const max = maxScroll();
  track.classList.toggle('is-empty', max <= 1);
  if (max <= 1) return;
  const vh = innerHeight;
  thumbH = Math.max((vh * vh) / (max + vh), 40);
  thumb.style.height = `${thumbH}px`;
  thumb.style.transform = `translate3d(0, ${(scrollY / max) * (vh - thumbH)}px, 0)`;
  if (!show) return;
  track.classList.add('is-active');
  clearTimeout(idle);
  idle = window.setTimeout(() => track.classList.remove('is-active'), 900);
}

thumb.addEventListener('pointerdown', (e) => {
  e.preventDefault();
  thumb.setPointerCapture(e.pointerId);
  track.classList.add('is-dragging');
  const startY = e.clientY;
  const startScroll = scrollY;
  const ratio = maxScroll() / (innerHeight - thumbH);
  const move = (ev: PointerEvent) => scrollTo(0, startScroll + (ev.clientY - startY) * ratio);
  const end = () => {
    track.classList.remove('is-dragging');
    thumb.removeEventListener('pointermove', move);
    thumb.removeEventListener('pointerup', end);
    thumb.removeEventListener('pointercancel', end);
  };
  thumb.addEventListener('pointermove', move);
  thumb.addEventListener('pointerup', end);
  thumb.addEventListener('pointercancel', end);
});

track.addEventListener('pointerdown', (e) => {
  if (e.target === thumb) return;
  scrollTo(0, ((e.clientY - thumbH / 2) / (innerHeight - thumbH)) * maxScroll());
});

/* Mobile menu --------------------------------------------------------------- */

const menuBtn = document.querySelector<HTMLButtonElement>('[data-menu-btn]')!;
const menu = document.querySelector<HTMLElement>('[data-menu]')!;

function setMenu(open: boolean) {
  header.classList.toggle('is-open', open);
  header.classList.remove('is-hidden');
  menuBtn.setAttribute('aria-expanded', String(open));
  menu.classList.toggle('is-open', open);
  menu.inert = !open;
  menu.setAttribute('aria-hidden', String(!open));
  root.classList.toggle('menu-open', open);
  root.style.overflow = open ? 'hidden' : '';
}

menuBtn.addEventListener('click', () => setMenu(menuBtn.getAttribute('aria-expanded') !== 'true'));
menu.querySelectorAll('[data-menu-close]').forEach((a) => a.addEventListener('click', () => setMenu(false)));
addEventListener('keydown', (e) => e.key === 'Escape' && setMenu(false));

/* Quote: touch screens have no hover, so the light dashboard shows while the
   section sits in the middle of the screen ---------------------------------- */

const quote = document.querySelector<HTMLElement>('.quote');

if (quote && matchMedia('(hover: none)').matches && 'IntersectionObserver' in window) {
  new IntersectionObserver(([e]) => quote.classList.toggle('is-lit', e.isIntersecting), {
    rootMargin: '-35% 0px -35% 0px',
  }).observe(quote);
}

/* Wiring --------------------------------------------------------------------- */

addEventListener(
  'scroll',
  () => {
    updateHeader();
    updateParallax();
    updateSheet();
    updateScrollbar();
  },
  { passive: true }
);
addEventListener('resize', () => {
  measure();
  updateSheet();
  updateScrollbar(false);
});
new ResizeObserver(() => updateScrollbar(false)).observe(root);

measure();
updateHeader();
updateParallax();
updateSheet();
updateScrollbar(false);
