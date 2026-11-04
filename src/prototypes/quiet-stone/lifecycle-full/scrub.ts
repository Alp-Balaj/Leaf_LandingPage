// The full-page lifecycle: the scene pins for five viewport heights and scroll scrubs one
// timeline. A stage change is one direction of motion: the screen pans a little toward the
// next card's corner while dissolving, the outgoing card drifts that way and fades, the next
// card arrives from the same side. Rest points are short shelves; the move fills the middle of
// each segment, so every bit of scroll shows. Touch devices, phones and reduced motion get the
// stacked layout instead, where observers mark the steps and bring each card in.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { markStep, watchSeen, watchSteps } from './steps';
import type { Place } from './screens';

gsap.registerPlugin(ScrollTrigger);

// Only a fine pointer that hovers gets the pinned scrub: a finger on a pinned scene fights it.
const LIVE = '(prefers-reduced-motion: no-preference) and (width > 900px) and (hover: hover) and (pointer: fine)';
const STILL = '(prefers-reduced-motion: reduce), (width <= 900px), (hover: none), (pointer: coarse)';

// Each segment runs from k to k + 1: a shelf, the move, a shelf.
const HOLD = 0.2;
const MOVE = 1 - 2 * HOLD;
// The last stage holds this long before the scene lets go into the next section.
const TAIL = 0.45;
// How far the screen pans (percent of itself; scene.css overscales it to make room) and how
// far a card drifts (px) during a change.
const PAN = 2;
const DRIFT = 56;
// The shelves are not dead: through them the card and screen keep leaning toward the next
// move by this much, so motion is continuous up to the rest point and the snap's overshoot
// shows as a settle.
const LEAN = 18;
const LEAN_PAN = 0.7;
// On the way in and out the screen lags the scroll by this much (percent) and the veil over
// its edge covers this much of the viewport at most.
const LAG = 6;
const VEIL = 0.7;

const clamp01 = (x: number) => Math.min(Math.max(x, 0), 1);
// 0 to 1 as x runs from a to b.
const span = (x: number, a: number, b: number) => clamp01((x - a) / (b - a));

type Vec = [number, number];

// Direction from one card corner to the next, as a unit-ish vector in screen space.
function direction(from: Place, to: Place): Vec {
  const at = (p: Place): Vec => {
    const [v, h] = p.split('-');
    return [h === 'left' ? -1 : 1, v === 'top' ? -1 : v === 'bottom' ? 1 : 0];
  };
  const [ax, ay] = at(from);
  const [bx, by] = at(to);
  const dx = bx - ax;
  const dy = by - ay;
  const len = Math.hypot(dx, dy) || 1;
  return [dx / len, dy / len];
}

function placeOf(stage: HTMLElement): Place {
  const cls = [...stage.classList].find((c) => c.startsWith('at-'));
  return (cls ? cls.slice(3) : 'top-right') as Place;
}

// The screens past the first load lazily. Fetch them all once the scene comes within a
// viewport, so no crossfade lands on a screen that has not arrived.
function preload(root: HTMLElement): IntersectionObserver | undefined {
  const imgs = [...root.querySelectorAll<HTMLImageElement>('img[loading="lazy"]')];
  if (!imgs.length) return;
  const go = () => imgs.forEach((img) => (img.loading = 'eager'));
  if (!('IntersectionObserver' in window)) {
    go();
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      go();
      io.disconnect();
    },
    { rootMargin: '100% 0px 100% 0px' }
  );
  io.observe(root);
  return io;
}

export function mountScrub(): void {
  const root = document.querySelector<HTMLElement>('[data-lf="scrub"]');
  if (!root) return;
  const pin = root.querySelector<HTMLElement>('[data-pin]');
  if (!pin) return;

  preload(root);

  const mm = gsap.matchMedia();

  mm.add(LIVE, () => {
    root.classList.add('is-live');

    const stageEls = [...root.querySelectorAll<HTMLElement>('[data-stage]')];
    const shots = [...root.querySelectorAll<HTMLElement>('[data-shot]')];
    const cards = [...root.querySelectorAll<HTMLElement>('[data-card]')];
    // The glass and the copy fade as a pair. Opacity goes on the glass itself, never on the
    // card, or the backdrop blur loses sight of the screen behind it. Movement goes on the card.
    const fades = cards.map((c) => [...c.children] as HTMLElement[]);
    const steps = [...root.querySelectorAll<HTMLElement>('[data-step]')];
    const head = root.querySelector<HTMLElement>('[data-head]');
    const headFades = head ? ([...head.children] as HTMLElement[]) : [];
    const veilTop = root.querySelector<HTMLElement>('[data-veil="top"]');
    const veilBottom = root.querySelector<HTMLElement>('[data-veil="bottom"]');
    const n = shots.length;
    const dirs = stageEls.slice(1).map((s, k) => direction(placeOf(stageEls[k]), placeOf(s)));

    const tl = gsap.timeline({ paused: true });

    // Every tween states both ends and renders only when the playhead reaches it, so a refresh
    // or the lead-in can never bake a wrong start value in. The starting picture is set here.
    gsap.set(shots.slice(1), { autoAlpha: 0 });
    gsap.set(fades.slice(1).flat(), { autoAlpha: 0 });
    gsap.set([veilTop, veilBottom], { scaleY: 0 });
    const still = { immediateRender: false };

    for (let k = 0; k < n - 1; k++) {
      const [dx, dy] = dirs[k];
      const t0 = k + HOLD;
      const t1 = k + 1 - HOLD;
      const half = MOVE / 2;
      const at = (v: number): [number, number] => [dx * v, dy * v];
      const xy = ([x, y]: [number, number]) => ({ xPercent: x, yPercent: y });
      const px = ([x, y]: [number, number]) => ({ x, y });

      // The screens: both layers travel the same way, the old one leaving, the new one arriving.
      // Through the shelves they lean, in the move they pan.
      tl.fromTo(shots[k], xy(at(0)), { ...xy(at(-LEAN_PAN)), duration: HOLD, ease: 'none', ...still }, k);
      tl.fromTo(shots[k], xy(at(-LEAN_PAN)), { ...xy(at(-PAN)), duration: MOVE, ease: 'power2.inOut', ...still }, t0);
      tl.fromTo(shots[k + 1], { ...xy(at(PAN)), autoAlpha: 0 }, { ...xy(at(LEAN_PAN)), autoAlpha: 1, duration: MOVE, ease: 'power2.inOut', ...still }, t0);
      tl.fromTo(shots[k + 1], xy(at(LEAN_PAN)), { ...xy(at(0)), duration: HOLD, ease: 'none', ...still }, t1);

      // The cards: the first half of the move hands off to the second, with a hair of overlap so
      // no frame is empty. Drift goes on the card, alpha on its children.
      tl.fromTo(cards[k], px(at(0)), { ...px(at(LEAN)), duration: HOLD, ease: 'none', ...still }, k);
      tl.fromTo(cards[k], px(at(LEAN)), { ...px(at(DRIFT)), duration: half, ease: 'power2.in', ...still }, t0);
      tl.fromTo(fades[k], { autoAlpha: 1 }, { autoAlpha: 0, duration: half * 0.9, ease: 'power1.in', ...still }, t0);
      tl.fromTo(cards[k + 1], px(at(-DRIFT)), { ...px(at(-LEAN)), duration: half, ease: 'power2.out', ...still }, t0 + half);
      tl.fromTo(cards[k + 1], px(at(-LEAN)), { ...px(at(0)), duration: HOLD, ease: 'none', ...still }, t1);
      tl.fromTo(fades[k + 1], { autoAlpha: 0 }, { autoAlpha: 1, duration: half * 0.9, ease: 'power1.out', ...still }, t0 + half * 0.95);
    }
    // The tail shelf: time passes, nothing moves, then the pin lets go.
    tl.to({}, { duration: TAIL }, n - 1);

    const total = tl.duration();
    const rest = Array.from({ length: n }, (_, k) => k / total);
    // Snap finishes the move you started: past a small dead band it goes on to the next shelf
    // in the direction of travel, never back; inside the band it settles where it was.
    const BAND = 0.08 / total;
    const snapTo = (value: number, self?: ScrollTrigger) => {
      const dir = self?.direction ?? 1;
      const near = rest.reduce((a, b) => (Math.abs(b - value) < Math.abs(a - value) ? b : a));
      if (Math.abs(value - near) <= BAND) return near;
      const ahead = dir > 0 ? rest.find((r) => r > value) : [...rest].reverse().find((r) => r < value);
      return ahead ?? near;
    };
    // The strip: bars fill with the scroll, the numeral nearest the playhead lights.
    const paint = (time: number) => {
      for (let j = 0; j < steps.length; j++) {
        const f = Math.min(Math.max(time - j + 1, 0), 1);
        steps[j].style.setProperty('--f', f.toFixed(3));
      }
      markStep(root, Math.min(Math.round(time), n - 1));
    };

    const st = ScrollTrigger.create({
      trigger: pin,
      start: 'top top',
      end: () => '+=' + total * innerHeight,
      pin: true,
      anticipatePin: 1,
      scrub: 0.2,
      animation: tl,
      // Snap finishes the move you started and never pulls back; no inertia, so a fling
      // lands on the nearest shelf, not the last one. It overshoots a little and settles,
      // which the lean turns into a visible landing.
      snap: {
        snapTo,
        duration: { min: 0.5, max: 0.9 },
        delay: 0.06,
        ease: 'back.out(1.8)',
        inertia: false,
      },
      onUpdate: (self) => paint(self.progress * total),
      invalidateOnRefresh: true,
    });

    // The approach: as the scene slides up under the section before it, the first screen
    // emerges from the black, lagging the scroll a little, and the card and head settle in,
    // so the pin engages on a scene at rest. The veil keeps the screen's top edge black until
    // the last moment, so there is never a line.
    const lead = gsap.timeline({
      scrollTrigger: {
        trigger: root,
        start: 'top bottom',
        end: 'top top',
        scrub: true,
      },
    });
    lead
      // y in px on the screen and yPercent on the card, never the main timeline's
      // xPercent/yPercent and x/y: the two never fight over a property.
      .fromTo(shots[0], { autoAlpha: 0.35, y: () => (-LAG / 100) * innerHeight }, { autoAlpha: 1, y: 0, ease: 'none', duration: 1 }, 0)
      .fromTo(cards[0], { yPercent: 12 }, { yPercent: 0, ease: 'power1.out', duration: 0.6 }, 0.4)
      .fromTo(fades[0], { autoAlpha: 0 }, { autoAlpha: 1, ease: 'none', duration: 0.5 }, 0.45);
    if (veilTop) lead.fromTo(veilTop, { scaleY: VEIL }, { scaleY: 0, ease: 'power1.in', duration: 0.5 }, 0.5);
    if (head) {
      lead
        .fromTo(head, { y: 24 }, { y: 0, ease: 'power1.out', duration: 0.6 }, 0.3)
        .fromTo(headFades, { autoAlpha: 0 }, { autoAlpha: 1, ease: 'none', duration: 0.5 }, 0.35);
    }

    // The release: once the pin lets go the scene scrolls away. Its last screen sinks back into
    // the black the same way the first came out of it, and the card and head leave first.
    // Written imperatively, so nothing here renders before the scene has actually let go.
    const last = n - 1;
    const release = (q: number) => {
      const out = gsap.parseEase('power1.out');
      // Brightness, not opacity: the screen before this one is still opaque underneath.
      const dim = 1 - 0.65 * span(q, 0, 0.7);
      gsap.set(shots[last], { y: (LAG / 100) * innerHeight * q, filter: q > 0 ? `brightness(${dim.toFixed(3)})` : 'none' });
      gsap.set(cards[last], { yPercent: 12 * out(span(q, 0, 0.4)) });
      gsap.set(fades[last], { autoAlpha: 1 - span(q, 0, 0.35) });
      if (veilBottom) gsap.set(veilBottom, { scaleY: VEIL * out(span(q, 0, 0.5)) });
      if (head) {
        gsap.set(head, { y: -24 * out(span(q, 0, 0.4)) });
        gsap.set(headFades, { autoAlpha: 1 - span(q, 0, 0.35) });
      }
    };
    let released = false;
    const exit = ScrollTrigger.create({
      trigger: root,
      start: 'bottom bottom',
      end: 'bottom top',
      onUpdate: (self) => {
        if (self.progress === 0 && !released) return;
        released = self.progress > 0;
        release(self.progress);
      },
    });
    if (exit.progress > 0) {
      released = true;
      release(exit.progress);
    }

    paint(st.progress * total);

    // Jump links scroll to the shelf of their stage inside the pinned range.
    const onJump = (e: Event) => {
      const link = (e.target as HTMLElement).closest<HTMLElement>('[data-step]');
      if (!link || !root.contains(link)) return;
      e.preventDefault();
      const k = Number(link.dataset.step);
      scrollTo({ top: st.start + rest[k] * (st.end - st.start), behavior: 'smooth' });
    };
    root.addEventListener('click', onJump);

    // Fonts change the height of the sections above, so the pin start moves.
    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    return () => {
      root.removeEventListener('click', onJump);
      root.classList.remove('is-live');
      lead.scrollTrigger?.kill();
      lead.kill();
      exit.kill();
      steps.forEach((s) => s.style.removeProperty('--f'));
    };
  });

  mm.add(STILL, () => {
    const steps = watchSteps(root);
    const seen = watchSeen(root);
    return () => {
      steps?.disconnect();
      seen?.disconnect();
    };
  });
}
