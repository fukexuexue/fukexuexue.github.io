(() => {
  'use strict';
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const portrait = document.querySelector('.profile-photos');
  if (portrait) {
    const setPortrait = active => {
      portrait.classList.toggle('show-alternate', active);
      portrait.setAttribute('aria-pressed', String(active));
      portrait.setAttribute('aria-label', active ? 'Show first portrait' : 'Show alternate portrait');
    };
    portrait.addEventListener('pointerenter', event => {
      if (event.pointerType === 'mouse') setPortrait(true);
    });
    portrait.addEventListener('pointerleave', event => {
      if (event.pointerType === 'mouse') setPortrait(false);
    });
    portrait.addEventListener('pointercancel', () => setPortrait(false));
    portrait.addEventListener('click', event => {
      // Touch and keyboard users can still switch portraits by activating the button.
      if (event.pointerType === 'mouse' && event.detail > 0) return;
      setPortrait(!portrait.classList.contains('show-alternate'));
    });
  }
  // The center of the ink landscape follows the exact pointer position.
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const cursor = document.createElement('span');
  cursor.className = 'ink-cursor';
  cursor.setAttribute('aria-hidden', 'true');
  const mountain = new Image();
  mountain.alt = '';
  let cursorReady = false;
  mountain.onload = () => { cursorReady = true; };
  mountain.src = 'assets/img/ink-mountain-cursor.png';
  cursor.appendChild(mountain);
  document.body.appendChild(cursor);
  const hideCursor = () => {
    cursor.classList.remove('visible');
    document.documentElement.classList.remove('ink-cursor-active');
  };
  document.addEventListener('pointermove', event => {
    if (!cursorReady || !finePointer.matches || event.pointerType !== 'mouse') {
      hideCursor();
      return;
    }
    cursor.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
    cursor.classList.toggle('over-control', Boolean(event.target.closest('a, button, input, select, textarea')));
    cursor.classList.add('visible');
    document.documentElement.classList.add('ink-cursor-active');
  }, { passive: true });
  document.addEventListener('pointerdown', event => {
    if (!cursorReady || !finePointer.matches || event.pointerType !== 'mouse' || reduced.matches) return;
    if (!event.target.closest('img, .paper-image-link, .profile-photos')) return;
    cursor.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
    cursor.classList.remove('ink-bloom');
    // Restart the ink wash for each click, including rapid repeated clicks.
    void mountain.offsetWidth;
    cursor.classList.add('ink-bloom');
  }, { passive: true });
  mountain.addEventListener('animationend', () => cursor.classList.remove('ink-bloom'));
  document.documentElement.addEventListener('pointerleave', hideCursor);
  document.addEventListener('pointercancel', hideCursor);
  document.addEventListener('keydown', hideCursor);
  window.addEventListener('blur', hideCursor);
  document.addEventListener('visibilitychange', hideCursor);
  finePointer.addEventListener('change', hideCursor);
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (!reduced.matches) entry.target.classList.add('motion-reveal');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: .08 });
    document.querySelectorAll('.publications > h3, .bibliography > li').forEach(item => observer.observe(item));
  }
})();
