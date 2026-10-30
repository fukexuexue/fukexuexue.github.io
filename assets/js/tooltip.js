document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.social-icons').forEach(group => {
    const label = document.createElement('div');
    label.className = 'social-link-label';
    label.setAttribute('aria-hidden', 'true');
    group.appendChild(label);
    group.querySelectorAll('a').forEach(link => {
      const name = link.getAttribute('title') || link.getAttribute('aria-label') || '';
      link.setAttribute('aria-label', name);
      link.removeAttribute('title');
      const show = () => { label.textContent = name; };
      const clear = () => {
        const active = group.querySelector('a:hover, a:focus-visible');
        label.textContent = active ? active.getAttribute('aria-label') : '';
      };
      link.addEventListener('mouseenter', show);
      link.addEventListener('mouseleave', clear);
      link.addEventListener('focus', show);
      link.addEventListener('blur', clear);
    });
  });
});
