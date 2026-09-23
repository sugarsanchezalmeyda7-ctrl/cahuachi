const revealItems = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });
revealItems.forEach((item) => observer.observe(item));

const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.main-nav');
menuToggle?.addEventListener('click', () => {
  const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!isOpen));
  navigation.classList.toggle('mobile-open', !isOpen);
});
navigation?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  menuToggle?.setAttribute('aria-expanded', 'false');
  navigation.classList.remove('mobile-open');
}));

const visitorCount = document.querySelector('#visitor-count');
if (visitorCount) {
  try {
    const storageKey = 'cahuachi-visitor-count';
    const storedVisits = Number.parseInt(localStorage.getItem(storageKey) || '0', 10);
    const visits = Number.isFinite(storedVisits) ? storedVisits + 1 : 1;
    localStorage.setItem(storageKey, String(visits));
    visitorCount.textContent = visits.toLocaleString('es-PE');
  } catch {
    visitorCount.textContent = '1';
  }
}

const floatingSurvey = document.querySelector('.floating-survey');
let surveyDrag = null;
let suppressSurveyClick = false;

floatingSurvey?.addEventListener('pointerdown', (event) => {
  if (event.button !== undefined && event.button !== 0) return;

  const bounds = floatingSurvey.getBoundingClientRect();
  surveyDrag = {
    pointerId: event.pointerId,
    startX: event.clientX,
    startY: event.clientY,
    offsetX: event.clientX - bounds.left,
    offsetY: event.clientY - bounds.top,
    moved: false,
  };
  floatingSurvey.setPointerCapture(event.pointerId);
  floatingSurvey.classList.add('is-dragging');
});

floatingSurvey?.addEventListener('pointermove', (event) => {
  if (!surveyDrag || event.pointerId !== surveyDrag.pointerId) return;

  const distance = Math.hypot(event.clientX - surveyDrag.startX, event.clientY - surveyDrag.startY);
  if (distance > 5) surveyDrag.moved = true;
  if (!surveyDrag.moved) return;

  const bounds = floatingSurvey.getBoundingClientRect();
  const left = Math.min(Math.max(0, event.clientX - surveyDrag.offsetX), window.innerWidth - bounds.width) + window.scrollX;
  const top = Math.min(Math.max(0, event.clientY - surveyDrag.offsetY), window.innerHeight - bounds.height) + window.scrollY;
  floatingSurvey.style.left = `${left}px`;
  floatingSurvey.style.top = `${top}px`;
  floatingSurvey.style.right = 'auto';
});

const finishSurveyDrag = (event) => {
  if (!surveyDrag || event.pointerId !== surveyDrag.pointerId) return;
  suppressSurveyClick = surveyDrag.moved;
  floatingSurvey.classList.remove('is-dragging');
  floatingSurvey.releasePointerCapture(event.pointerId);
  surveyDrag = null;
};

floatingSurvey?.addEventListener('pointerup', finishSurveyDrag);
floatingSurvey?.addEventListener('pointercancel', finishSurveyDrag);
floatingSurvey?.addEventListener('click', (event) => {
  if (!suppressSurveyClick) return;
  event.preventDefault();
  suppressSurveyClick = false;
});

