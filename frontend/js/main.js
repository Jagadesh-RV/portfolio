document.addEventListener('DOMContentLoaded', () => {
  // Mobile Menu Toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const navLinksContainer = document.getElementById('nav-links');
  
  if (mobileMenuBtn && navLinksContainer) {
    mobileMenuBtn.addEventListener('click', () => {
      navLinksContainer.classList.toggle('active');
      const icon = mobileMenuBtn.querySelector('i');
      if (navLinksContainer.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-xmark');
      } else {
        icon.classList.remove('fa-xmark');
        icon.classList.add('fa-bars');
      }
    });

    // Close menu when clicking a link
    const navLinks = navLinksContainer.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navLinksContainer.classList.remove('active');
        const icon = mobileMenuBtn.querySelector('i');
        icon.classList.remove('fa-xmark');
        icon.classList.add('fa-bars');
      });
    });
  }

  // Navigation active state on scroll (Scroll Spy)
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (pageYOffset >= (sectionTop - 150)) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').includes(current)) {
        link.classList.add('active');
      }
    });
  });

  // Back to Top Button
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 500) {
        backToTopBtn.classList.add('show');
      } else {
        backToTopBtn.classList.remove('show');
      }
    });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // Intersection Observer for Fade-in Scroll Animations
  const fadeElements = document.querySelectorAll('.fade-in');
  const fadeObserverOptions = {
    root: null,
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  };

  const fadeObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // Only animate once
      }
    });
  }, fadeObserverOptions);

  fadeElements.forEach(el => {
    fadeObserver.observe(el);
  });

  // Contact Form Submission
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = e.target.querySelector('button');
      const originalText = btn.innerHTML;
      btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Sending...';
      
      const payload = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value
      };

      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        
        if (data.success) {
          btn.innerHTML = '<i class="fa-solid fa-check"></i> Sent Successfully!';
          btn.style.backgroundColor = '#16a34a'; // Success green
          btn.style.color = 'white';
          e.target.reset();
        } else {
          btn.innerHTML = data.message || 'Error! Try Again';
          btn.style.backgroundColor = '#ef4444'; // Error red
          btn.style.color = 'white';
        }
      } catch (err) {
        btn.innerHTML = 'Network Error! Try Again';
        btn.style.backgroundColor = '#ef4444';
        btn.style.color = 'white';
      }
      
      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.backgroundColor = '';
        btn.style.color = '';
      }, 3000);
    });
  }

  // Dynamic Glow Effect tracking mouse
  document.querySelectorAll('.glow-effect').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
});
