// js/main.js — Scroll effects and animations

// 1. Make navbar background darker when user scrolls
const nav = document.getElementById('mainNav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  });
}

// 2. Fade cards in when they scroll into view
// IntersectionObserver watches elements and fires when they become visible
const revealItems = document.querySelectorAll(
  '.project-card, .skill-card, .fw-card, .tl-item'
);

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity   = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target); // stop watching once visible
    }
  });
}, { threshold: 0.08 });

// Set each card to invisible + shifted down before animating
revealItems.forEach(el => {
  el.style.opacity    = '0';
  el.style.transform  = 'translateY(22px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  observer.observe(el);
});

// 3. Animate skill bars on the skills page
const skillFills = document.querySelectorAll('.skill-fill');
const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animated');
      barObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

skillFills.forEach(el => barObserver.observe(el));