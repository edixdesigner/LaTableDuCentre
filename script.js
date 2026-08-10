// Repli visuel universel : si une image ne charge pas, un visuel de marque élégant la remplace
const svgPlaceholder = (function(){
  const svg = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'>"
    + "<rect width='400' height='400' fill='%231c1a17'/>"
    + "<rect x='14' y='14' width='372' height='372' fill='none' stroke='%23c6a15b' stroke-width='1.5'/>"
    + "<circle cx='200' cy='170' r='34' fill='none' stroke='%23c6a15b' stroke-width='1.5'/>"
    + "<text x='200' y='250' font-family='Georgia,serif' font-size='26' fill='%23e8d3a3' text-anchor='middle' letter-spacing='2'>LA TABLE</text>"
    + "<text x='200' y='280' font-family='Georgia,serif' font-size='16' fill='%23c6a15b' text-anchor='middle' letter-spacing='4'>DU CENTRE</text>"
    + "</svg>";
  return 'data:image/svg+xml,' + svg.replace(/#/g,'%23').replace(/'/g,'%27');
})();
document.querySelectorAll('img').forEach(img => {
  img.addEventListener('error', function(){
    if(this.dataset.fallbackApplied) return;
    this.dataset.fallbackApplied = 'true';
    this.src = svgPlaceholder;
  });
});

// Filtrage de la galerie (page Galerie uniquement)
const filterBtns = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.g-item');
if(filterBtns.length && galleryItems.length){
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      galleryItems.forEach(item => {
        const match = filter === 'tout' || item.dataset.cat === filter;
        if(match){
          item.style.display = '';
          requestAnimationFrame(() => item.classList.remove('hidden'));
        } else {
          item.classList.add('hidden');
          window.setTimeout(() => {
            if(item.classList.contains('hidden')) item.style.display = 'none';
          }, 400);
        }
      });
    });
  });
}

// Onglets de la carte (page La Carte uniquement)
const tabBtns = document.querySelectorAll('.tab-btn');
const menuPanels = document.querySelectorAll('.menu-panel');
if(tabBtns.length && menuPanels.length){
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;
      tabBtns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected','false'); });
      btn.classList.add('active'); btn.setAttribute('aria-selected','true');
      menuPanels.forEach(panel => {
        if(panel.dataset.panel === target){
          panel.classList.add('panel-in');
        } else {
          panel.classList.remove('panel-in');
        }
      });
    });
  });
}

// Particules lumineuses chaleureuses dans le hero (page Accueil uniquement)
const embersWrap = document.getElementById('embers');
if(embersWrap && !window.matchMedia('(prefers-reduced-motion: reduce)').matches){
  const count = window.innerWidth < 760 ? 10 : 18;
  for(let i=0;i<count;i++){
    const e = document.createElement('span');
    e.className = 'ember';
    const left = Math.random()*100;
    const duration = 7 + Math.random()*8;
    const delay = Math.random()*10;
    const drift = (Math.random()*60-30) + 'px';
    const size = 2 + Math.random()*3;
    e.style.left = left + '%';
    e.style.width = size + 'px';
    e.style.height = size + 'px';
    e.style.animationDuration = duration + 's';
    e.style.animationDelay = delay + 's';
    e.style.setProperty('--drift', drift);
    embersWrap.appendChild(e);
  }
}

// Barre de progression au scroll (toutes les pages)
const scrollProgress = document.getElementById('scrollProgress');
if(scrollProgress){
  const updateProgress = () => {
    const h = document.documentElement;
    const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
    scrollProgress.style.width = scrolled + '%';
  };
  window.addEventListener('scroll', updateProgress, {passive:true});
  updateProgress();
}

// Header background on scroll (toutes les pages)
const header = document.getElementById('siteHeader');
if(header){
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  }, {passive:true});
}

// Subtle parallax on hero (page Accueil uniquement)
const heroBg = document.getElementById('heroBg');
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if(heroBg && !prefersReduced){
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if(y < window.innerHeight){
      heroBg.style.transform = `scale(1.08) translateY(${y * 0.15}px)`;
    }
  }, {passive:true});
}

// Scroll reveal (toutes les pages)
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add('in');
      io.unobserve(entry.target);
    }
  });
}, {threshold:0.15});
revealEls.forEach(el => io.observe(el));

// Mobile burger -> simple toggle to nav overlay (basic accessible fallback)
const burger = document.getElementById('burger');
const nav = document.querySelector('nav.mainnav');
if(burger && nav){
  burger.addEventListener('click', () => {
    const isOpen = nav.style.display === 'flex';
    if(isOpen){
      nav.style.display = 'none';
    } else {
      nav.style.cssText = 'display:flex;position:fixed;inset:0;top:64px;background:#0b0b0a;flex-direction:column;align-items:center;justify-content:flex-start;padding-top:3rem;gap:2rem;z-index:999;';
      nav.querySelector('ul').style.cssText = 'display:flex;flex-direction:column;gap:2rem;text-align:center;';
    }
  });
  document.querySelectorAll('nav.mainnav a').forEach(a=>{
    a.addEventListener('click', ()=>{ if(window.innerWidth<=760){ nav.style.display='none'; } });
  });
}
