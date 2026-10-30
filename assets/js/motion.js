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
  // Keep the native pointer until the decorative asset is ready.
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  if (finePointer.matches) {
    const cursor = document.createElement('span');
    cursor.className = 'loopy-cursor';
    cursor.setAttribute('aria-hidden', 'true');
    const character = document.createElement('span');
    character.className = 'loopy-character';
    cursor.appendChild(character);
    for (let i = 0; i < 24; i++) {
      const spark = document.createElement('span');
      spark.className = 'loopy-spark';
      const angle = i * Math.PI / 12;
      spark.style.setProperty('--dx', `${Math.cos(angle) * (i % 2 ? 72 : 100)}px`);
      spark.style.setProperty('--dy', `${Math.sin(angle) * (i % 2 ? 72 : 100)}px`);
      spark.style.setProperty('--delay', `${i % 2 * 160}ms`);
      cursor.appendChild(spark);
    }
    document.body.appendChild(cursor);
    let ready = false;
    let position = null;
    const hide = () => {
      cursor.classList.remove('is-visible', 'is-over-image');
      document.documentElement.classList.remove('loopy-active');
      position = null;
    };
    const checkImage = () => {
      if (!position) return;
      const target = document.elementFromPoint(position.x, position.y);
      cursor.classList.toggle('is-over-image', Boolean(target?.closest('img, .profile-photos')));
    };
    const show = () => {
      if (!ready || !position || !finePointer.matches) return;
      cursor.style.transform = `translate3d(${Math.min(position.x + 14, window.innerWidth - 30)}px, ${Math.min(position.y + 14, window.innerHeight - 30)}px, 0)`;
      cursor.classList.add('is-visible');
      document.documentElement.classList.add('loopy-active');
      checkImage();
    };
    const asset = new Image();
    asset.onload = () => { ready = true; show(); };
    asset.src = 'assets/img/Loopy1.png';
    document.addEventListener('pointermove', event => {
      if (event.pointerType !== 'mouse') { hide(); return; }
      position = { x: event.clientX, y: event.clientY };
      show();
    }, { passive: true });
    document.documentElement.addEventListener('pointerleave', hide);
    document.addEventListener('pointercancel', hide);
    window.addEventListener('blur', hide);
    window.addEventListener('scroll', checkImage, { passive: true });
    document.addEventListener('visibilitychange', hide);
    finePointer.addEventListener('change', hide);
  }
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
