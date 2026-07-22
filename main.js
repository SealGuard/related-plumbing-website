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

  // ========== CONTACT FORM (placeholder) ==========
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('button[type="submit"]');
      const original = btn.textContent;
      btn.textContent = 'Request Received!';
      btn.disabled = true;
      btn.style.background = '#2E7D32';
      setTimeout(() => {
        btn.textContent = original;
        btn.disabled = false;
        btn.style.background = '';
        contactForm.reset();
      }, 3000);
    });
  }

  // ========== WRENCH RAIL + ACTIVE SECTIONS ==========
  const wrench = document.getElementById('slidingWrench');
  const rail = document.getElementById('wrenchRail');
  const markers = document.querySelectorAll('.marker');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!wrench || !rail) {
    // Still handle nav active even without wrench
    setupNavObserver();
    return;
  }

  // Position markers dynamically based on actual section positions
  function positionMarkers() {
    const railRect = rail.getBoundingClientRect();
    const railTop = rail.offsetTop; // relative? better use scroll positions
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    
    sections.forEach(section => {
      const id = section.id;
      const marker = document.querySelector(`.marker[data-section="${id}"]`);
      if (!marker) return;
      
      // Approximate progress of section start
      const sectionTop = section.offsetTop;
      const progress = Math.min(Math.max(sectionTop / (document.documentElement.scrollHeight - window.innerHeight * 0.5), 0), 1);
      // For visual, keep CSS percentages or set top %
      // We'll leave CSS positions and just use for active state
    });
  }

  // Smooth wrench position based on scroll progress
  let ticking = false;
  
  function updateWrench() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? Math.min(Math.max(scrollTop / docHeight, 0), 1) : 0;
    
    const railHeight = rail.clientHeight;
    const wrenchHeight = wrench.offsetHeight || 140;
    const travel = Math.max(railHeight - wrenchHeight, 0);
    
    // Use transform for performance
    wrench.style.transform = `translateX(-50%) translateY(${progress * travel}px)`;
    
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateWrench);
      ticking = true;
    }
  }, { passive: true });

  window.addEventListener('resize', () => {
    updateWrench();
  });

  // Initial call
  updateWrench();

  // IntersectionObserver for active states
  const observerOptions = {
    root: null,
    rootMargin: '-30% 0px -50% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        
        // Markers
        markers.forEach(m => {
          m.classList.toggle('active', m.dataset.section === id);
        });
        
        // Nav links
        navLinks.forEach(link => {
          const href = link.getAttribute('href');
          link.classList.toggle('active', href === `#${id}`);
        });
        
        // Grip animation on inner
        const inner = document.getElementById('wrenchInner');
        if (inner) {
          inner.classList.add('gripping');
          setTimeout(() => inner.classList.remove('gripping'), 450);
        }
      }
    });
  }, observerOptions);

  sections.forEach(sec => observer.observe(sec));

  // Also observe home specially if needed
  function setupNavObserver() {
    // fallback already covered
  }
});
