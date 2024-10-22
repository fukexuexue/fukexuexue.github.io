document.addEventListener('DOMContentLoaded', function() {
    const icons = document.querySelectorAll('.social-icons a');
    
    icons.forEach(icon => {
      const tooltip = document.createElement('div');
      tooltip.className = 'tooltip';
      tooltip.textContent = icon.getAttribute('title');
      icon.appendChild(tooltip);
  
      icon.addEventListener('mouseenter', () => {
        tooltip.style.opacity = '1';
        tooltip.style.visibility = 'visible';
      });
  
      icon.addEventListener('mouseleave', () => {
        tooltip.style.opacity = '0';
        tooltip.style.visibility = 'hidden';
      });
    });
  });