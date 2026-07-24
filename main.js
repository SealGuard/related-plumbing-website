// Related Companies Plumbing Services - Main JS

document.addEventListener('DOMContentLoaded', () => {
  // ========== MOBILE MENU ==========
  const mobileToggle = document.getElementById('mobileToggle');
  const mainNav = document.getElementById('mainNav');
  
  if (mobileToggle && mainNav) {
    mobileToggle.addEventListener('click', () => {
      mainNav.classList.toggle('open');
      mobileToggle.classList.toggle('open');
    });
    
    // Close on link click
    mainNav.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('open');
        mobileToggle.classList.remove('open');
      });
    });
  }

  // ========== CONTACT FORM ==========
  // Let the form POST normally to Formsubmit (no preventDefault)
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', () => {
      const btn = contactForm.querySelector('button[type="submit"]');
      if (btn) {
        btn.textContent = 'Sending...';
        btn.disabled = true;
      }
    });
  }

  // ========== WRENCH RAIL + ACTIVE SECTIONS ==========
  const wrench = document.getElementById('slidingWrench');
  const rail = document.getElementById('wrenchRail');
  const markers = document.querySelectorAll('.marker');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!wrench || !rail) {
    return;
  }

  let ticking = false;
  
  function updateWrench() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? Math.min(Math.max(scrollTop / docHeight, 0), 1) : 0;
    
    const railHeight = rail.clientHeight;
    const wrenchHeight = wrench.offsetHeight || 140;
    const travel = Math.max(railHeight - wrenchHeight, 0);
    
    wrench.style.transform = `translateX(-50%) translateY(${progress * travel}px)`;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateWrench);
      ticking = true;
    }
  }, { passive: true });

  window.addEventListener('resize', updateWrench);
  updateWrench();

  const observerOptions = {
    root: null,
    rootMargin: '-30% 0px -50% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        
        markers.forEach(m => {
          m.classList.toggle('active', m.dataset.section === id);
        });
        
        navLinks.forEach(link => {
          const href = link.getAttribute('href');
          link.classList.toggle('active', href === `#${id}`);
        });
        
        const inner = document.getElementById('wrenchInner');
        if (inner) {
          inner.classList.add('gripping');
          setTimeout(() => inner.classList.remove('gripping'), 450);
        }
      }
    });
  }, observerOptions);

  sections.forEach(sec => observer.observe(sec));
});
