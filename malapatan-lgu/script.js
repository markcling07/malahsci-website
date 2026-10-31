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

  const scrollingDown = y > lastY && y > header.offsetHeight + 40;
  header.classList.toggle('header-hidden', scrollingDown && !nav.classList.contains('open'));
  lastY = y;
}, { passive: true });

// Philippine Standard Time clock (UTC+8), whatever the visitor's own time zone is
const clock = document.getElementById('pst-clock');
const pstFormat = new Intl.DateTimeFormat('en-PH', {
  timeZone: 'Asia/Manila',
  weekday: 'short', month: 'short', day: 'numeric',
  hour: 'numeric', minute: '2-digit', second: '2-digit'
});
const tick = () => { clock.textContent = pstFormat.format(new Date()); };
tick();
setInterval(tick, 1000);

// Barangays: 2020 census population (PSA)
const barangays = [
  { name: 'Poblacion', pop: 16259 },
  { name: 'Kinam', pop: 12779 },
  { name: 'Lun Padidu', pop: 12177 },
  { name: 'Sapu Masla', pop: 7542 },
  { name: 'Tuyan', pop: 6414 },
  { name: 'Lun Masla', pop: 5250 },
  { name: 'Upper Suyan', pop: 4985 },
  { name: 'Daan Suyan', pop: 4163 },
  { name: 'Kihan', pop: 4029 },
  { name: 'Sapu Padidu', pop: 2853 },
  { name: 'Libi', pop: 2195 },
  { name: 'Patag', pop: 2095 }
];
const total = barangays.reduce((sum, b) => sum + b.pop, 0);
const largest = Math.max(...barangays.map(b => b.pop));

const list = document.getElementById('brgy-list');
const empty = document.getElementById('brgy-empty');
const search = document.getElementById('brgy-search');
const sortButtons = document.querySelectorAll('.sort button');
let sortBy = 'pop';

function renderBarangays() {
  const query = search.value.trim().toLowerCase();
  const shown = barangays
    .filter(b => b.name.toLowerCase().includes(query))
    .sort((a, b) => sortBy === 'pop' ? b.pop - a.pop : a.name.localeCompare(b.name));

  list.innerHTML = shown.map(b => `
    <li class="brgy">
      <div class="brgy-head"><strong>${b.name}</strong><span>${b.pop.toLocaleString('en-PH')}</span></div>
      <div class="brgy-bar"><i style="width:${(b.pop / largest * 100).toFixed(1)}%"></i></div>
      <span class="brgy-share">${(b.pop / total * 100).toFixed(1)}% of the town's population</span>
    </li>`).join('');
  empty.hidden = shown.length > 0;
}

search.addEventListener('input', renderBarangays);
sortButtons.forEach(button => {
  button.addEventListener('click', () => {
    sortBy = button.dataset.sort;
    sortButtons.forEach(b => b.classList.toggle('active', b === button));
    renderBarangays();
  });
});
renderBarangays();

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();
