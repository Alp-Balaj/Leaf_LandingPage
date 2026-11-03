// The full-page lifecycle: the scene pins for five viewport heights and scroll scrubs one
// timeline that crossfades the screens in place, the card fading out and back in at the next
// stage's position. Below 900px and under reduced motion the stages stack and snap, and
// observers mark the steps and bring each card in.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { markStep, watchSeen, watchSteps } from './steps';

gsap.registerPlugin(ScrollTrigger);

const LIVE = '(prefers-reduced-motion: no-preference) and (width > 900px)';
const STILL = '(prefers-reduced-motion: reduce), (width <= 900px)';

export function mountScrub(): void {
  const root = document.querySelector<HTMLElement>('[data-lf="scrub"]');
  if (!root) return;
  const pin = root.querySelector<HTMLElement>('[data-pin]');
  if (!pin) return;

  const mm = gsap.matchMedia();

  mm.add(LIVE, () => {
    root.classList.add('is-live');

    const shots = [...root.querySelectorAll<HTMLElement>('[data-shot]')];
    // The glass and the copy fade as a pair. Opacity goes on the glass itself, never on an
    // ancestor, or the backdrop blur loses sight of the screen behind it.
    const cards = [...root.querySelectorAll<HTMLElement>('[data-card]')].map((c) => [...c.children]);
    const copy = [...root.querySelectorAll<HTMLElement>('[data-card-in]')];
    const n = shots.length;
    const tl = gsap.timeline({ paused: true });

    // Rest points sit at integer times; segment k runs from k to k + 1.
    gsap.set(shots.slice(1), { autoAlpha: 0, scale: 1.04 });
    gsap.set(cards.slice(1).flat(), { autoAlpha: 0 });
    gsap.set(copy.slice(1), { y: 16 });

    for (let k = 0; k < n - 1; k++) {
      tl.to(shots[k + 1], { autoAlpha: 1, scale: 1, duration: 0.4, ease: 'power1.inOut' }, k + 0.3);
      tl.to(cards[k], { autoAlpha: 0, duration: 0.2, ease: 'power1.in' }, k + 0.3);
      tl.to(copy[k], { y: -16, duration: 0.2, ease: 'power1.in' }, k + 0.3);
      tl.to(cards[k + 1], { autoAlpha: 1, duration: 0.2, ease: 'power1.out' }, k + 0.5);
      tl.to(copy[k + 1], { y: 0, duration: 0.2, ease: 'power1.out' }, k + 0.5);
    }

    const st = ScrollTrigger.create({
      trigger: pin,
      start: 'top top',
      end: () => '+=' + (n - 1) * innerHeight,
      pin: true,
      anticipatePin: 1,
      scrub: 0.5,
      animation: tl,
      // No inertia: a fast fling lands on the nearest stage, not the last one.
      snap: {
        snapTo: 1 / (n - 1),
        duration: { min: 0.25, max: 0.7 },
        delay: 0.05,
        ease: 'power1.inOut',
        inertia: false,
      },
      onUpdate: (self) => markStep(root, Math.round(self.progress * (n - 1))),
      invalidateOnRefresh: true,
    });

    // Jump links scroll to the rest point of their stage inside the pinned range.
    const onJump = (e: Event) => {
      const link = (e.target as HTMLElement).closest<HTMLElement>('[data-step]');
      if (!link || !root.contains(link)) return;
      e.preventDefault();
      const k = Number(link.dataset.step);
      scrollTo({ top: st.start + (k / (n - 1)) * (st.end - st.start), behavior: 'smooth' });
    };
    root.addEventListener('click', onJump);

    // Fonts change the height of the sections above, so the pin start moves.
    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    return () => {
      root.removeEventListener('click', onJump);
      root.classList.remove('is-live');
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
