/* Progressive enhancement: all product information is in index.html. */
const form = document.querySelector('#configuration');
const enquiryLinks = document.querySelectorAll('[data-configuration-link]');

function updateConfiguration() {
  const data = new FormData(form);
  const furniture = data.get('furniture');
  const upholstery = data.get('upholstery');
  const edition = data.get('edition');
  const weight = data.get('weight');
  document.querySelector('#selection-summary').textContent = `Diamond · ${edition} · ${weight}`;
  const body = `Guten Tag,\n\nich interessiere mich für folgende Skydancer Diamond Konfiguration:\n\nMöbelfarbe: ${furniture}\nPolster: ${upholstery}\nAusführung: ${edition}\nZulässiges Gesamtgewicht: ${weight}\n\nBitte kontaktieren Sie mich zu Ausstattung, technischer Machbarkeit und einem individuellen Angebot.`;
  const url = `mailto:milakubinsky@gmail.com?subject=${encodeURIComponent('Meine Skydancer Diamond Konfiguration')}&body=${encodeURIComponent(body)}`;
  enquiryLinks.forEach(link => { link.href = url; });
}

if (form) {
  form.addEventListener('change', updateConfiguration);
  updateConfiguration();
}

const menuButton = document.querySelector('.menu-button');
const navigation = document.querySelector('#main-navigation');
function closeMenu() {
  navigation.classList.remove('nav-open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Menü öffnen');
}
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  navigation.classList.toggle('nav-open', open);
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
});
navigation.addEventListener('click', event => {
  if (event.target.closest('a')) closeMenu();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    menuButton.focus();
  }
});

const views = [
  { file: 'skydancer-diamond-front', width: 1255, height: 750, label: 'Diamond · Frontansicht', alt: 'Skydancer Diamond Cabrio-Camper in der Frontansicht mit Panoramakabine' },
  { file: 'skydancer-diamond-side', width: 1263, height: 751, label: 'Diamond · Seitenansicht', alt: 'Skydancer Diamond Cabrio-Reisemobil in der Seitenansicht' },
  { file: 'skydancer-diamond-panorama', width: 1400, height: 750, label: 'Diamond · Panoramaansicht', alt: 'Skydancer Diamond mit Cabrio-Dach in der Panoramaansicht' }
];
let currentView = 0;
const stage = document.querySelector('.vehicle-stage');
const vehicleImage = stage.querySelector('.vehicle-image');
const vehicleSource = stage.querySelector('source');
const viewLabel = document.querySelector('#view-label');
function changeView(direction) {
  currentView = (currentView + direction + views.length) % views.length;
  const view = views[currentView];
  vehicleSource.srcset = `assets/${view.file}-768.webp 768w, assets/${view.file}.webp ${view.width}w`;
  vehicleImage.src = `${view.file}.jpg`;
  vehicleImage.alt = view.alt;
  vehicleImage.width = view.width;
  vehicleImage.height = view.height;
  viewLabel.textContent = view.label;
  stage.querySelectorAll('.hotspot').forEach(button => { button.hidden = currentView !== 0; });
}
document.querySelector('[data-view="previous"]').addEventListener('click', () => changeView(-1));
document.querySelector('[data-view="next"]').addEventListener('click', () => changeView(1));
stage.addEventListener('keydown', event => {
  if (event.target !== stage || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
  event.preventDefault();
  changeView(event.key === 'ArrowRight' ? 1 : -1);
});
let pointerStart = null;
stage.addEventListener('pointerdown', event => {
  if (event.target.closest('button, a') || event.button !== 0) return;
  pointerStart = { x: event.clientX, y: event.clientY, id: event.pointerId };
  stage.setPointerCapture(event.pointerId);
});
stage.addEventListener('pointerup', event => {
  if (!pointerStart) return;
  const x = event.clientX - pointerStart.x;
  const y = event.clientY - pointerStart.y;
  if (Math.abs(x) > 40 && Math.abs(x) > Math.abs(y)) changeView(x > 0 ? -1 : 1);
  pointerStart = null;
});
stage.addEventListener('pointercancel', () => { pointerStart = null; });

stage.querySelectorAll('.hotspot').forEach(button => {
  button.addEventListener('click', () => {
    stage.querySelectorAll('.hotspot').forEach(other => {
      const active = button === other;
      other.classList.toggle('is-active', active);
      other.setAttribute('aria-pressed', String(active));
    });
    document.querySelector('#feature-title').textContent = button.dataset.title;
    document.querySelector('#feature-text').textContent = button.dataset.description;
    document.querySelector('#feature-icon use').setAttribute('href', button.querySelector('use').getAttribute('href'));
  });
});
document.querySelectorAll('.service-pin').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.service-pin').forEach(other => {
      other.setAttribute('aria-pressed', String(other === button));
    });
    document.querySelector('#service-caption').textContent = `${button.dataset.title}: ${button.dataset.description}`;
  });
});
document.documentElement.classList.add('js-ready');
