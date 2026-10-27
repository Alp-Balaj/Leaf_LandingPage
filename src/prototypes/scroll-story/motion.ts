import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

const STAGES = 6;

const mm = gsap.matchMedia();

mm.add(
  {
    motion: '(prefers-reduced-motion: no-preference)',
    desktop: '(min-width: 900px)',
  },
  (ctx) => {
    const { motion, desktop } = ctx.conditions as { motion: boolean; desktop: boolean };
    if (!motion) return;

    /* ---------------------------------------------------------------- */
    /* Hero: headline by words, then lede, actions, byline, the record.  */
    /* ---------------------------------------------------------------- */

    const hero = document.querySelector<HTMLElement>('.hero');
    const h1 = hero?.querySelector<HTMLElement>('h1');
    const heroMock = hero?.querySelector<HTMLElement>('.hero-mock');

    if (hero && h1 && heroMock) {
      const rises = hero.querySelectorAll<HTMLElement>('[data-rise]');

      const playHero = () => {
        ctx.add(() => {
          const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

          const split = SplitText.create(h1, {
            type: 'words',
            aria: 'auto',
            wordsClass: 'w',
          });
          gsap.set(h1, { visibility: 'visible' });
          gsap.set(split.words, { display: 'inline-block' });

          tl.from(split.words, { yPercent: 70, opacity: 0, duration: 0.9, stagger: 0.055 }, 0)
            .fromTo(rises, { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.1 }, 0.45)
            .fromTo(
              heroMock,
              { y: 140, opacity: 0 },
              { y: 0, opacity: 1, duration: 1.3, ease: 'power3.out' },
              0.3,
            );
        });
      };

      if (document.fonts && document.fonts.status !== 'loaded') {
        document.fonts.ready.then(playHero, playHero);
      } else {
        playHero();
      }
    }

    /* ---------------------------------------------------------------- */
    /* 25% count-up: a tweened object writes into the stat once in view. */
    /* ---------------------------------------------------------------- */

    const stat = document.querySelector<HTMLElement>('[data-count]');
    if (stat) {
      const target = parseInt(stat.textContent || '25', 10) || 25;
      ScrollTrigger.create({
        trigger: stat,
        start: 'top 90%',
        once: true,
        onEnter: () => {
          const counter = { v: 0 };
          gsap.to(counter, {
            v: target,
            duration: 1.4,
            ease: 'power2.out',
            onUpdate: () => {
              stat.textContent = `${Math.round(counter.v)}%`;
            },
          });
        },
      });
    }

    /* ---------------------------------------------------------------- */
    /* Later sections: one batched reveal, played once.                  */
    /* ---------------------------------------------------------------- */

    const reveals = gsap.utils.toArray<HTMLElement>('[data-reveal]');
    if (reveals.length) {
      const pending = new Set(reveals);
      gsap.set(reveals, { y: 22, opacity: 0 });
      ScrollTrigger.batch(reveals, {
        start: 'top 92%',
        once: true,
        onEnter: (els) => {
          els.forEach((el) => pending.delete(el as HTMLElement));
          gsap.to(els, {
            y: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.07,
            ease: 'power3.out',
            overwrite: true,
          });
        },
      });

      // Safety: after a viewport change (rotation, window resize, headless capture)
      // scroll-position maths is stale, so anything still pending is shown at once.
      // Nothing is ever left at opacity 0 for a reader the triggers missed.
      const settle = () => {
        if (!pending.size) return;
        gsap.set(Array.from(pending), { y: 0, opacity: 1, overwrite: true });
        pending.clear();
      };
      window.addEventListener('resize', settle, { passive: true });
      ctx.add(() => () => window.removeEventListener('resize', settle));
    }

    /* ---------------------------------------------------------------- */
    /* Story: pinned record, scrubbed rail, stage-by-stage mutation.     */
    /* Desktop only; narrower screens use the stacked CSS layout.        */
    /* ---------------------------------------------------------------- */

    const story = document.querySelector<HTMLElement>('.story');
    const record = story?.querySelector<HTMLElement>('.record-story');
    const pinEl = story?.querySelector<HTMLElement>('.story-pin');
    const stagesEl = story?.querySelector<HTMLElement>('.story-stages');
    const railFill = story?.querySelector<HTMLElement>('.rail-fill');
    const blocks = gsap.utils.toArray<HTMLElement>('.stage-block');

    if (desktop && story && record && pinEl && stagesEl && railFill && blocks.length === STAGES) {
      let stage = -1;

      const setStage = (n: number) => {
        if (n === stage) return;
        const forward = n > stage;
        stage = n;
        record.dataset.stage = String(n);
        blocks.forEach((b, i) => b.classList.toggle('is-active', i === n));

        if (forward) {
          const fresh = record.querySelectorAll<HTMLElement>(`[data-from="${n}"], [data-only="${n}"]`);
          if (fresh.length) {
            gsap.fromTo(
              fresh,
              { y: 10, opacity: 0, scale: 0.985 },
              {
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 0.55,
                stagger: 0.07,
                ease: 'power3.out',
                clearProps: 'transform',
                overwrite: true,
              },
            );
          }
        }
      };

      // Pin the record while the stage copy scrolls past it.
      ScrollTrigger.create({
        trigger: pinEl,
        start: 'top 64px',
        endTrigger: stagesEl,
        end: 'bottom bottom',
        pin: true,
        pinSpacing: false,
        anticipatePin: 1,
      });

      // Progress rail, scrubbed to scroll.
      gsap.fromTo(
        railFill,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: stagesEl,
            start: 'top 60%',
            end: 'bottom 60%',
            scrub: 0.35,
          },
        },
      );

      // Each stage block drives the record when it crosses the reading line.
      blocks.forEach((block, i) => {
        ScrollTrigger.create({
          trigger: block,
          start: 'top 60%',
          end: 'bottom 40%',
          onEnter: () => setStage(i),
          onEnterBack: () => setStage(i),
        });
      });

      // Initial state: whichever block is already past the reading line.
      const line = window.innerHeight * 0.6;
      let initial = 0;
      blocks.forEach((b, i) => {
        if (b.getBoundingClientRect().top < line) initial = i;
      });
      setStage(initial);

      return () => {
        record.dataset.stage = '5';
        blocks.forEach((b) => b.classList.remove('is-active'));
      };
    }

    return undefined;
  },
);
