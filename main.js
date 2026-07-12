/* ════════════════════════════════════════════════════════════════
   PORTFOLIO — MAIN JAVASCRIPT
   ════════════════════════════════════════════════════════════════ */

'use strict';

// ─── State ───────────────────────────────────────────────────────
const state = {
  portfolioData: null,
  activeFilter: 'all',
  mouseX: 0,
  mouseY: 0,
  cursorX: 0,
  cursorY: 0
};

// ─── DOM Ready ───────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  await initLoader();
  initCursor();
  initNav();
  initReveal();
  await loadPortfolioData();
  initMarquee();
  initFilters();
  initContactForm();
  initParallax();
  initCounters();
  initMobileMenu();
});

// ─── Page Loader ─────────────────────────────────────────────────
async function initLoader() {
  const loader = document.querySelector('.page-loader');
  if (!loader) return;

  // Animate each character
  const text = loader.querySelector('.loader-text');
  if (text) {
    const content = text.textContent;
    text.innerHTML = content.split('').map((c, i) =>
      `<span style="animation-delay:${0.08 * i}s">${c}</span>`
    ).join('');
  }

  return new Promise(resolve => {
    setTimeout(() => {
      loader.classList.add('done');
      setTimeout(() => {
        loader.style.display = 'none';
        resolve();
      }, 700);
    }, 2000);
  });
}

// ─── Custom Cursor ───────────────────────────────────────────────
function initCursor() {
  const dot  = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  if (!dot || !ring) return;

  let ringX = 0, ringY = 0;
  let rafId;

  document.addEventListener('mousemove', e => {
    state.mouseX = e.clientX;
    state.mouseY = e.clientY;
    dot.style.left  = `${e.clientX}px`;
    dot.style.top   = `${e.clientY}px`;
  });

  const animateRing = () => {
    ringX += (state.mouseX - ringX) * 0.12;
    ringY += (state.mouseY - ringY) * 0.12;
    ring.style.left = `${ringX}px`;
    ring.style.top  = `${ringY}px`;
    rafId = requestAnimationFrame(animateRing);
  };
  animateRing();

  // Hover states
  const hoverEls = document.querySelectorAll('a, button, .skill-tag, .project-card, .exp-item, .filter-btn, input, textarea, select');
  hoverEls.forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hovering'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hovering'));
  });

  // Update hover states dynamically
  document.addEventListener('mouseover', e => {
    if (e.target.matches('a, button, .skill-tag, .project-card, .exp-item, .filter-btn, input, textarea, select, .cursor-hover')) {
      ring.classList.add('hovering');
      dot.style.opacity = '0';
    } else {
      ring.classList.remove('hovering');
      dot.style.opacity = '1';
    }
  });
}

// ─── Navigation ──────────────────────────────────────────────────
function initNav() {
  const nav = document.querySelector('.nav');
  if (!nav) return;

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  // Active section highlight
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.style.color = link.getAttribute('href') === `#${id}`
            ? 'var(--text)' : '';
        });
      }
    });
  }, { threshold: 0.5 });

  sections.forEach(s => observer.observe(s));

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });
}

// ─── Mobile Menu ─────────────────────────────────────────────────
function initMobileMenu() {
  const btn = document.querySelector('.nav-menu-btn');
  const links = document.querySelector('.nav-links');
  if (!btn || !links) return;

  let open = false;
  btn.addEventListener('click', () => {
    open = !open;
    links.style.display = open ? 'flex' : '';
    links.style.flexDirection = open ? 'column' : '';
    links.style.position = open ? 'absolute' : '';
    links.style.top = open ? '100%' : '';
    links.style.left = open ? '0' : '';
    links.style.right = open ? '0' : '';
    links.style.background = open ? 'rgba(5,5,5,0.97)' : '';
    links.style.padding = open ? '24px var(--gutter)' : '';
    links.style.borderBottom = open ? '1px solid var(--border)' : '';
    btn.querySelectorAll('span')[0].style.transform = open ? 'rotate(45deg) translate(4px, 5px)' : '';
    btn.querySelectorAll('span')[1].style.opacity = open ? '0' : '';
    btn.querySelectorAll('span')[2].style.transform = open ? 'rotate(-45deg) translate(4px, -5px)' : '';
  });

  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      if (open) btn.click();
    });
  });
}

// ─── Scroll Reveal ───────────────────────────────────────────────
function initReveal() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// ─── Counter Animation ───────────────────────────────────────────
function initCounters() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target || el.textContent);
        const suffix = el.textContent.replace(/[0-9]/g, '');
        let start = 0;
        const duration = 1800;
        const startTime = performance.now();

        const tick = (now) => {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.floor(eased * target) + suffix;
          if (progress < 1) requestAnimationFrame(tick);
        };

        requestAnimationFrame(tick);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.stat-value[data-target]').forEach(el => observer.observe(el));
}

// ─── Load Portfolio Data ──────────────────────────────────────────
async function loadPortfolioData() {
  try {
    const response = await fetch('/api/portfolio');
    if (!response.ok) throw new Error('API unavailable');
    state.portfolioData = await response.json();
  } catch (err) {
    console.warn('Using static fallback data');
    state.portfolioData = getStaticData();
  }

  renderHero();
  renderStats();
  renderAbout();
  renderProjects();
  renderExperience();
  renderContact();

  // Re-observe new elements
  setTimeout(initReveal, 50);
}

// ─── Render Hero ─────────────────────────────────────────────────
function renderHero() {
  const d = state.portfolioData;
  const { hero } = d;

  setEl('#hero-name',     hero.name.replace(' ', '<em> </em>'));
  setEl('#hero-subtitle', hero.tagline);
  setEl('#hero-badge-text', `${hero.location} · ${hero.availability}`);
}

// ─── Render Stats ────────────────────────────────────────────────
function renderStats() {
  const container = document.querySelector('.stats-inner');
  if (!container) return;

  const stats = state.portfolioData.stats;
  container.innerHTML = stats.map(stat => {
    const numVal = parseInt(stat.value);
    const suffix = stat.value.replace(/[0-9]/g, '');
    return `
      <div class="stat-item">
        <span class="stat-icon">${stat.icon}</span>
        <span class="stat-value" data-target="${numVal}">0${suffix}</span>
        <span class="stat-label">${stat.label}</span>
      </div>
    `;
  }).join('');

  // Re-init counters
  setTimeout(initCounters, 100);
}

// ─── Render About ────────────────────────────────────────────────
function renderAbout() {
  const d = state.portfolioData.about;

  setEl('#about-bio', d.bio);

  const renderTags = (arr) => arr.map(t =>
    `<span class="skill-tag">${t}</span>`
  ).join('');

  setHTML('#skills-frontend', renderTags(d.skills.frontend));
  setHTML('#skills-backend',  renderTags(d.skills.backend));
  setHTML('#skills-tools',    renderTags(d.skills.tools));
}

// ─── Render Projects ──────────────────────────────────────────────
function renderProjects(filter = 'all') {
  const container = document.querySelector('.projects-grid');
  if (!container || !state.portfolioData) return;

  const projects = state.portfolioData.projects.filter(p =>
    filter === 'all' || p.category.toLowerCase() === filter.toLowerCase()
  );

  container.innerHTML = projects.map(project => `
    <div class="project-card ${project.featured ? 'featured' : ''} reveal"
         data-category="${project.category}"
         style="--card-accent: ${project.color}">
      <div class="project-color-bar" style="background: ${project.color}"></div>
      <div class="project-card-top">
        <div class="project-meta">
          <span class="project-category">${project.category}</span>
          <span class="project-year">${project.year}</span>
        </div>
        <h3 class="project-title">${project.title}</h3>
        <p class="project-desc">${project.description}</p>
      </div>
      <div class="project-card-bottom">
        <div class="project-tech">
          ${project.tech.map(t => `<span class="tech-chip">${t}</span>`).join('')}
        </div>
        <div class="project-arrow">↗</div>
      </div>
    </div>
  `).join('');

  // Animate in
  requestAnimationFrame(() => {
    container.querySelectorAll('.project-card').forEach((card, i) => {
      card.style.transitionDelay = `${i * 0.06}s`;
      card.classList.add('visible');
    });
  });
}

// ─── Render Experience ───────────────────────────────────────────
function renderExperience() {
  const container = document.querySelector('.experience-list');
  if (!container || !state.portfolioData) return;

  container.innerHTML = state.portfolioData.experience.map((exp, i) => `
    <div class="exp-item reveal reveal-delay-${i + 1}">
      <div>
        <div class="exp-role">${exp.role}</div>
        <div class="exp-company">${exp.company}</div>
        <p class="exp-desc">${exp.desc}</p>
      </div>
      <div class="exp-period">${exp.period}</div>
    </div>
  `).join('');
}

// ─── Render Contact ──────────────────────────────────────────────
function renderContact() {
  const { social } = state.portfolioData;
  const links = [
    { label: 'GitHub', href: social.github, icon: '◈' },
    { label: 'LinkedIn', href: social.linkedin, icon: '◈' },
    { label: 'Twitter / X', href: social.twitter, icon: '◈' },
    { label: 'Dribbble', href: social.dribbble, icon: '◈' }
  ];

  const container = document.querySelector('.contact-links');
  if (container) {
    container.innerHTML = links.map(l => `
      <a class="contact-link" href="${l.href}" target="_blank" rel="noopener">
        <span>${l.icon}</span>
        <span>${l.label}</span>
        <span style="margin-left: auto; color: var(--text-3)">↗</span>
      </a>
    `).join('');
  }
}

// ─── Project Filters ─────────────────────────────────────────────
function initFilters() {
  document.addEventListener('click', e => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;

    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.activeFilter = btn.dataset.filter;
    renderProjects(state.activeFilter);
  });
}

// ─── Contact Form ────────────────────────────────────────────────
function initContactForm() {
  const form = document.querySelector('.contact-form');
  const status = document.querySelector('.form-status');
  const submitBtn = form?.querySelector('[type="submit"]');
  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();

    const data = {
      name:    form.querySelector('[name="name"]').value.trim(),
      email:   form.querySelector('[name="email"]').value.trim(),
      subject: form.querySelector('[name="subject"]')?.value.trim(),
      message: form.querySelector('[name="message"]').value.trim()
    };

    if (!data.name || !data.email || !data.message) {
      showStatus(status, 'error', '✕ Please fill in all required fields.');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const json = await res.json();

      if (json.success) {
        showStatus(status, 'success', '✓ Message sent! I\'ll be in touch soon.');
        form.reset();
      } else {
        showStatus(status, 'error', `✕ ${json.message}`);
      }
    } catch (err) {
      showStatus(status, 'error', '✕ Network error. Please try again.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Message →';
    }
  });
}

function showStatus(el, type, msg) {
  if (!el) return;
  el.className = `form-status ${type}`;
  el.textContent = msg;
  setTimeout(() => { if (el) el.className = 'form-status'; }, 5000);
}

// ─── Parallax ────────────────────────────────────────────────────
function initParallax() {
  const glows = document.querySelectorAll('.hero-glow');
  if (!glows.length) return;

  document.addEventListener('mousemove', e => {
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;

    glows[0]?.style.setProperty('transform',
      `translate(${x * 30}px, ${y * 20}px) scale(1)`);
    glows[1]?.style.setProperty('transform',
      `translate(${-x * 25}px, ${-y * 15}px) scale(1)`);
  }, { passive: true });
}

// ─── Marquee ─────────────────────────────────────────────────────
function initMarquee() {
  const items = [
    'React', '✦', 'Node.js', '◈', 'TypeScript', '✦',
    'PostgreSQL', '◈', 'Three.js', '✦', 'Next.js', '◈',
    'GraphQL', '✦', 'Docker', '◈', 'AWS', '✦', 'Figma', '◈'
  ];

  document.querySelectorAll('.marquee-track').forEach(track => {
    const doubled = [...items, ...items];
    track.innerHTML = doubled.map((item, i) =>
      `<span${[1,3,5,7,9,11,13,15,17,19].includes(i % items.length) ? ' class="accent"' : ''}>${item}</span>`
    ).join('');
  });
}

// ─── Static Fallback Data ─────────────────────────────────────────
function getStaticData() {
  return {
    hero: {
      name: "Alex Mercer",
      title: "Full-Stack Developer & Creative Technologist",
      tagline: "Crafting digital experiences at the intersection of code & design",
      location: "San Francisco, CA",
      availability: "Available for freelance"
    },
    stats: [
      { label: "Projects Completed", value: "50+", icon: "⚡" },
      { label: "Years Experience", value: "6+", icon: "🚀" },
      { label: "Happy Clients", value: "30+", icon: "✦" },
      { label: "Technologies", value: "20+", icon: "◈" }
    ],
    about: {
      bio: "I build production-grade web applications with obsessive attention to performance, accessibility, and design. Specializing in React ecosystems, Node.js backends, and creative frontend experiences.",
      skills: {
        frontend: ["React", "Next.js", "TypeScript", "Three.js", "GSAP", "Tailwind CSS"],
        backend: ["Node.js", "Express", "PostgreSQL", "Redis", "GraphQL", "Docker"],
        tools: ["Git", "AWS", "Figma", "Webpack", "Vite", "CI/CD"]
      }
    },
    projects: [
      { id:1, title:"NeuralViz Platform", category:"Full-Stack", description:"Real-time neural network visualization tool used by ML researchers at 3 universities.", tech:["React","Three.js","Python","WebSockets"], year:"2024", color:"#00ff87", featured:true },
      { id:2, title:"Meridian CMS", category:"Backend", description:"Headless CMS handling 2M+ content requests daily with GraphQL API.", tech:["Node.js","GraphQL","PostgreSQL","Redis"], year:"2024", color:"#ff6b35", featured:true },
      { id:3, title:"Spatial UI Kit", category:"Frontend", description:"Open-source component library for spatial/AR interfaces, 2k+ GitHub stars.", tech:["React","TypeScript","CSS","Storybook"], year:"2023", color:"#a855f7", featured:true },
      { id:4, title:"FinFlow Dashboard", category:"Full-Stack", description:"Real-time financial analytics with live market data and AI-powered insights.", tech:["Next.js","D3.js","Prisma","tRPC"], year:"2023", color:"#06b6d4", featured:false },
      { id:5, title:"Echelon E-Commerce", category:"Full-Stack", description:"High-performance platform processing $2M+ monthly transactions.", tech:["Next.js","Stripe","PostgreSQL","Vercel"], year:"2023", color:"#f59e0b", featured:false },
      { id:6, title:"Luminary Mobile", category:"Mobile", description:"Cross-platform wellness app with AI coaching and 50k+ active users.", tech:["React Native","Expo","Node.js","ML Kit"], year:"2022", color:"#10b981", featured:false }
    ],
    experience: [
      { role:"Senior Frontend Engineer", company:"Vercel", period:"2023 – Present", desc:"Leading performance initiatives. Reduced bundle size by 40% and improved Core Web Vitals." },
      { role:"Full-Stack Developer", company:"Stripe", period:"2021 – 2023", desc:"Built merchant dashboard features used by 1M+ businesses. Owned payment analytics visualization." },
      { role:"Frontend Developer", company:"Linear", period:"2019 – 2021", desc:"Shipped collaborative editing and keyboard shortcut systems. Core design system contributor." }
    ],
    social: { github:"#", twitter:"#", linkedin:"#", dribbble:"#" }
  };
}

// ─── Utilities ───────────────────────────────────────────────────
function setEl(selector, text) {
  const el = document.querySelector(selector);
  if (el) el.innerHTML = text;
}

function setHTML(selector, html) {
  const el = document.querySelector(selector);
  if (el) el.innerHTML = html;
}