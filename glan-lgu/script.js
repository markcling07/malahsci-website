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

// Task finder tabs: Residents / Businesses / Visitors (arrow keys move between tabs)
const tabs = [...document.querySelectorAll('[role="tab"]')];

function selectTab(tab) {
  tabs.forEach(t => {
    const selected = t === tab;
    t.setAttribute('aria-selected', selected);
    t.tabIndex = selected ? 0 : -1;
    document.getElementById(t.getAttribute('aria-controls')).hidden = !selected;
  });
}

tabs.forEach((tab, i) => {
  tab.addEventListener('click', () => selectTab(tab));
  tab.addEventListener('keydown', e => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    const next = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
    selectTab(next);
    next.focus();
  });
});

// Barangays: 2020 census population (PSA)
const barangays = [
  { name: 'Baliton', pop: 6108 },
  { name: 'Batotuling', pop: 1041 },
  { name: 'Batulaki', pop: 1995 },
  { name: 'Big Margus', pop: 4732 },
  { name: 'Burias', pop: 2965 },
  { name: 'Cablalan', pop: 3234 },
  { name: 'Calabanit', pop: 6010 },
  { name: 'Calpidong', pop: 1896 },
  { name: 'Congan', pop: 2346 },
  { name: 'Cross', pop: 2190 },
  { name: 'Datalbukay', pop: 6069 },
  { name: 'E. Alegado', pop: 4065 },
  { name: 'Glan Padidu', pop: 4674 },
  { name: 'Gumasa', pop: 3392 },
  { name: 'Ilaya', pop: 4566 },
  { name: 'Kaltuad', pop: 2320 },
  { name: 'Kapatan', pop: 3481 },
  { name: 'Lago', pop: 1873 },
  { name: 'Laguimit', pop: 3485 },
  { name: 'Mudan', pop: 2369 },
  { name: 'New Aklan', pop: 1811 },
  { name: 'Pangyan', pop: 6858 },
  { name: 'Poblacion', pop: 7582 },
  { name: 'Rio del Pilar', pop: 1491 },
  { name: 'San Jose', pop: 1664 },
  { name: 'San Vicente', pop: 3213 },
  { name: 'Small Margus', pop: 3434 },
  { name: 'Sufatubo', pop: 2484 },
  { name: 'Taluya', pop: 6583 },
  { name: 'Tango', pop: 2481 },
  { name: 'Tapon', pop: 3135 }
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
    <li class="brgy" title="${(b.pop / total * 100).toFixed(1)}% of the town's population">
      <strong>${b.name}</strong><span>${b.pop.toLocaleString('en-PH')}</span>
      <div class="brgy-bar" aria-hidden="true"><i style="width:${(b.pop / largest * 100).toFixed(1)}%"></i></div>
    </li>`).join('');
  empty.hidden = shown.length > 0;
}

search.addEventListener('input', renderBarangays);
sortButtons.forEach(button => {
  button.addEventListener('click', () => {
    sortBy = button.dataset.sort;
    sortButtons.forEach(b => b.setAttribute('aria-pressed', b === button));
    renderBarangays();
  });
});
renderBarangays();

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();
