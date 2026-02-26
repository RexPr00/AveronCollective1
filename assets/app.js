const body = document.body;
const qs = (s, c = document) => c.querySelector(s);
const qsa = (s, c = document) => [...c.querySelectorAll(s)];

qsa('.lang-trigger').forEach(btn => {
  btn.addEventListener('click', e => {
    e.stopPropagation();
    const wrap = btn.closest('.lang-dropdown');
    const open = wrap.classList.toggle('open');
    btn.setAttribute('aria-expanded', String(open));
  });
});
document.addEventListener('click', () => qsa('.lang-dropdown.open').forEach(d => d.classList.remove('open')));

const burger = qs('.burger');
const drawer = qs('.mobile-drawer');
const backdrop = qs('.drawer-backdrop');
const closeBtn = qs('.drawer-close');
let lastFocus = null;
const focusable = 'a,button,input,summary,[tabindex]:not([tabindex="-1"])';

function trapKey(e, panel) {
  if (e.key === 'Escape') closeDrawer();
  if (e.key !== 'Tab') return;
  const nodes = qsa(focusable, panel).filter(n => !n.disabled);
  if (!nodes.length) return;
  const first = nodes[0], last = nodes[nodes.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}
function openDrawer() {
  lastFocus = document.activeElement;
  body.classList.add('drawer-open'); body.style.overflow = 'hidden';
  drawer.setAttribute('aria-hidden', 'false'); burger.setAttribute('aria-expanded', 'true');
  qsa(focusable, drawer)[0]?.focus();
}
function closeDrawer() {
  body.classList.remove('drawer-open'); body.style.overflow = '';
  drawer.setAttribute('aria-hidden', 'true'); burger?.setAttribute('aria-expanded', 'false');
  lastFocus?.focus();
}
burger?.addEventListener('click', openDrawer);
closeBtn?.addEventListener('click', closeDrawer);
backdrop?.addEventListener('click', closeDrawer);
document.addEventListener('keydown', e => { if (body.classList.contains('drawer-open')) trapKey(e, drawer); });
qsa('.mobile-drawer a').forEach(a => a.addEventListener('click', closeDrawer));

const calc = qs('[data-calculator]');
if (calc) {
  let amount = 50000;
  const monthInput = qs('[data-months]', calc);
  const monthLabel = qs('[data-month-label]', calc);
  const low = qs('[data-low]', calc), base = qs('[data-base]', calc), high = qs('[data-high]', calc);
  const format = v => `$${Math.round(v).toLocaleString('en-US')}`;
  const update = () => {
    const months = Number(monthInput.value);
    monthLabel.textContent = `${months} months`;
    const l = amount * Math.pow(1.08, months);
    const b = amount * Math.pow(1.11, months);
    const h = amount * Math.pow(1.15, months);
    low.textContent = format(l); base.textContent = format(b); high.textContent = format(h);
  };
  qsa('[data-amount]', calc).forEach(btn => btn.addEventListener('click', () => {
    qsa('[data-amount]', calc).forEach(b => b.classList.remove('active'));
    btn.classList.add('active'); amount = Number(btn.dataset.amount); update();
  }));
  monthInput.addEventListener('input', update); update();
}

qsa('.faq-list details').forEach(d => d.addEventListener('toggle', () => {
  if (d.open) qsa('.faq-list details').forEach(o => { if (o !== d) o.open = false; });
}));

const modal = qs('#privacy-modal');
const openers = qsa('[data-open-privacy]');
const closers = qsa('[data-close-privacy], .modal-x');
function openModal(e){e.preventDefault(); modal.classList.add('open'); body.style.overflow='hidden'; qsa(focusable, modal)[0]?.focus();}
function closeModal(){modal.classList.remove('open'); body.style.overflow='';}
openers.forEach(o=>o.addEventListener('click',openModal));
closers.forEach(c=>c.addEventListener('click',closeModal));
modal?.addEventListener('click',e=>{if(e.target===modal)closeModal();});
document.addEventListener('keydown',e=>{if(modal?.classList.contains('open')){if(e.key==='Escape')closeModal();trapKey(e,modal);}});

const observer = new IntersectionObserver(entries => {
  entries.forEach(ent => { if (ent.isIntersecting) ent.target.classList.add('in'); });
}, { threshold: 0.12 });
qsa('.section, .hero, .kpi-strip').forEach(el => observer.observe(el));
