import { animate, stagger, onScroll, createScope } from 'animejs';
import { splitText } from 'animejs/text';

const root = document.documentElement;

createScope({
  mediaQueries: { reduceMotion: '(prefers-reduced-motion: reduce)' },
}).add((self) => {
  const reduce = !!self.matches.reduceMotion;
  const dur = (ms: number) => (reduce ? 0 : ms);
  root.classList.toggle('anim', !reduce);

  /* Hero headline: split by lines, each line slides up inside its clip. */
  const h1 = document.querySelector<HTMLElement>('.hero h1[data-split]');
  if (h1 && !reduce && !h1.classList.contains('is-split')) {
    let played = false;
    const split = splitText(h1, {
      lines: { class: 'h1-line', wrap: 'clip' },
      words: true,
      accessible: true,
    });
    // Lines exist only once fonts are ready; the effect runs then (and after re-splits).
    split.addEffect(({ lines }: { lines: HTMLElement[] }) => {
      h1.classList.add('is-split');
      if (played || !lines.length) return;
      played = true;
      return animate(lines, {
        y: ['110%', '0%'],
        duration: 900,
        delay: stagger(110, { start: 60 }),
        ease: 'outExpo',
      });
    });
    // Never leave the headline hidden if the split never reports ready.
    setTimeout(() => h1.classList.add('is-split'), 1500);
  } else if (h1) {
    h1.classList.add('is-split');
  }

  /* Hero support: lede, actions, note and the record mock. These are in view on load. */
  const heroBits = Array.from(document.querySelectorAll<HTMLElement>('.hero [data-reveal]'));
  if (heroBits.length) {
    animate(heroBits, {
      opacity: [0, 1],
      y: [16, 0],
      duration: dur(700),
      delay: reduce ? 0 : stagger(90, { start: 420 }),
      ease: 'outCubic',
    });
  }

  /* Lifecycle ladder: hover, focus or click a rung to show its stage. */
  const rungs = Array.from(document.querySelectorAll<HTMLButtonElement>('#lifecycle .rung'));
  const panels = Array.from(document.querySelectorAll<HTMLElement>('#lifecycle .panel'));
  const ladder = document.querySelector<HTMLElement>('#lifecycle .ladder');
  let active = 0;

  const revealWord = (panel: HTMLElement) => {
    const word = panel.querySelector<HTMLElement>('.word');
    const text = panel.querySelector<HTMLElement>('.panel-text');
    if (word) animate(word, { y: ['100%', '0%'], duration: dur(650), ease: 'outExpo' });
    if (text) {
      animate(text, {
        opacity: [0, 1],
        y: [10, 0],
        duration: dur(450),
        delay: dur(120),
        ease: 'outCubic',
      });
    }
  };

  const setActive = (i: number, force = false) => {
    if (i === active && !force) return;
    active = i;
    rungs.forEach((r, j) => r.setAttribute('aria-expanded', String(j === i)));
    panels.forEach((p, j) => {
      p.hidden = j !== i;
    });
    revealWord(panels[i]);
  };

  rungs.forEach((r, i) => {
    r.addEventListener('click', () => setActive(i, true));
    r.addEventListener('pointerenter', () => setActive(i));
    r.addEventListener('focus', () => setActive(i));
  });

  /* Section reveals. Nothing is hidden on load: a page that is never scrolled
     (no JS, a print, a full-page capture) shows every section as it is. On the
     first real scroll, the elements still fully below the fold are armed, and
     each one plays once as it enters. Reduced motion skips arming entirely. */
  if (reduce) return;

  const below = (el: Element) => el.getBoundingClientRect().top > window.innerHeight + 24;
  const enter = 'bottom-=6% top';

  const arm = () => {
    document
      .querySelectorAll<HTMLElement>('[data-reveal]:not(.hero [data-reveal])')
      .forEach((el) => {
        if (!below(el)) return;
        animate(el, {
          opacity: [0, 1],
          y: [18, 0],
          duration: 650,
          ease: 'outCubic',
          autoplay: onScroll({ target: el, enter, repeat: false, sync: 'play' }),
        });
      });

    if (ladder && rungs.length && below(ladder)) {
      animate(rungs, {
        opacity: [0, 1],
        x: [-12, 0],
        duration: 500,
        delay: stagger(70),
        ease: 'outCubic',
        autoplay: onScroll({ target: ladder, enter, repeat: false, sync: 'play' }),
        onBegin: () => revealWord(panels[active]),
      });
    }
  };

  window.addEventListener('scroll', arm, { passive: true, once: true });
  return () => window.removeEventListener('scroll', arm);
});
