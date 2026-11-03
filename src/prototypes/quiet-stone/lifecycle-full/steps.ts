// Shared step tracking for the I to VI strip: the current stage gets aria-current, the
// ones passed get is-done. The pinned mechanics call markStep from ScrollTrigger; the
// curtain and every fallback watch the stages cross the middle of the viewport instead.

export function markStep(root: HTMLElement, k: number): void {
  root.querySelectorAll<HTMLElement>('[data-step]').forEach((s) => {
    const j = Number(s.dataset.step);
    s.classList.toggle('is-done', j < k);
    if (j === k) s.setAttribute('aria-current', 'step');
    else s.removeAttribute('aria-current');
  });
}

export function watchSteps(root: HTMLElement): IntersectionObserver | undefined {
  if (!('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        markStep(root, Number((e.target as HTMLElement).dataset.stage));
      }
    },
    { rootMargin: '-50% 0px -50% 0px' }
  );
  root.querySelectorAll<HTMLElement>('[data-stage]').forEach((el) => io.observe(el));
  return io;
}
