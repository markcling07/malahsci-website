// Mobile menu
const toggle = document.querySelector('.nav-toggle');
const nav = document.getElementById('main-nav');

toggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', open);
});

nav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  });
});

// Hide the header when scrolling down, show it again when scrolling up
const header = document.querySelector('.site-header');
let lastY = window.scrollY;

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  if (Math.abs(y - lastY) < 5) return; // ignore tiny movements

  const scrollingDown = y > lastY && y > header.offsetHeight;
  header.classList.toggle('header-hidden', scrollingDown && !nav.classList.contains('open'));
  lastY = y;
}, { passive: true });

// Program carousel: swipe on touch screens, drag with the mouse, or tap a dot
document.querySelectorAll('.carousel').forEach(carousel => {
  const track = carousel.querySelector('.carousel-track');
  const cards = [...track.children];
  const dotsBox = carousel.querySelector('.carousel-dots');

  const step = () => cards[1].offsetLeft - cards[0].offsetLeft; // card width + gap
  const maxIndex = () => Math.max(0, Math.ceil((track.scrollWidth - track.clientWidth - 2) / step()));
  const currentIndex = () => Math.round(track.scrollLeft / step());
  const goTo = i => track.scrollTo({ left: i * step(), behavior: 'smooth' });

  function buildDots() {
    dotsBox.innerHTML = '';
    for (let i = 0; i <= maxIndex(); i++) {
      const dot = document.createElement('button');
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsBox.appendChild(dot);
    }
    update();
  }

  function update() {
    const i = currentIndex();
    [...dotsBox.children].forEach((d, k) => d.classList.toggle('active', k === i));
  }

  // Touch screens swipe natively; this adds the same feel for mouse dragging
  let startX = 0, startScroll = 0, dragging = false, settleTimer;

  track.addEventListener('pointerdown', e => {
    if (e.pointerType !== 'mouse') return;
    clearTimeout(settleTimer);
    dragging = true;
    startX = e.clientX;
    startScroll = track.scrollLeft;
    track.classList.add('dragging');
    track.setPointerCapture(e.pointerId);
  });

  track.addEventListener('pointermove', e => {
    if (!dragging) return;
    track.scrollLeft = startScroll - (e.clientX - startX);
  });

  const endDrag = e => {
    if (!dragging) return;
    dragging = false;
    const moved = track.scrollLeft - startScroll;
    // A short flick is enough to move to the next or previous card
    const target = Math.abs(moved) > 40 ? Math.round(startScroll / step()) + Math.sign(moved) : currentIndex();
    goTo(Math.max(0, Math.min(target, maxIndex())));
    // Turn snapping back on only after the slide finishes, so it doesn't interrupt it
    settleTimer = setTimeout(() => track.classList.remove('dragging'), 600);
  };
  track.addEventListener('pointerup', endDrag);
  track.addEventListener('pointercancel', endDrag);

  track.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', buildDots);
  buildDots();
});

// Gallery lightbox
const lightbox = document.getElementById('lightbox');
const lightboxImg = lightbox.querySelector('img');

document.querySelectorAll('.gallery-item').forEach(item => {
  item.addEventListener('click', () => {
    const img = item.querySelector('img');
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightbox.hidden = false;
  });
});

lightbox.addEventListener('click', e => {
  if (e.target !== lightboxImg) lightbox.hidden = true;
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') lightbox.hidden = true;
});

// Inquiry form: opens the visitor's email app with the message filled in
const form = document.getElementById('contact-form');
const status = document.getElementById('form-status');

form.addEventListener('submit', e => {
  e.preventDefault();
  const name = form.name.value.trim();
  const program = form.program.value;
  const message = form.message.value.trim();

  if (!name || !message) {
    status.textContent = 'Please fill in your name and message.';
    status.className = 'form-status error';
    return;
  }

  const subject = `Inquiry: ${program}`;
  const body = `Name: ${name}\nProgram: ${program}\n\n${message}`;
  window.location.href = `mailto:malahscicollege@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  status.textContent = 'Opening your email app…';
  status.className = 'form-status ok';
});

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();
