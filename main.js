// ===== Professional Loader =====
window.addEventListener('load', () => {
  const loader    = document.getElementById('loader');
  const percent   = document.getElementById('loaderPercent');
  const bar       = document.getElementById('loaderBar');
  const circle    = document.getElementById('loaderCircle');
  const msg       = document.getElementById('loaderMsg');
  const circumference = 2 * Math.PI * 54; // r=54

  const messages = [
    'Initializing...',
    'Loading assets...',
    'Building UI...',
    'Optimizing...',
    'Almost ready...'
  ];

  let count = 0;

  function setProgress(val) {
    const offset = circumference - (val / 100) * circumference;
    circle.style.strokeDashoffset = offset;
    bar.style.width = val + '%';
    // update percent text (keep the <small> tag)
    percent.innerHTML = val + '<small>%</small>';

    const idx = Math.min(Math.floor(val / 20), messages.length - 1);
    if (msg.textContent !== messages[idx]) {
      msg.style.animation = 'none';
      msg.offsetHeight; // reflow
      msg.style.animation = '';
      msg.textContent = messages[idx];
    }
  }

  // init circle dash
  circle.style.strokeDasharray = circumference;
  circle.style.strokeDashoffset = circumference;

  const interval = setInterval(() => {
    count += Math.floor(Math.random() * 7) + 3;
    if (count >= 100) {
      count = 100;
      clearInterval(interval);
      setProgress(100);
      setTimeout(() => loader.classList.add('hidden'), 600);
    } else {
      setProgress(count);
    }
  }, 50);
});

// ===== Theme Toggle =====
const themeBtn = document.getElementById('themeBtn');
const currentTheme = localStorage.getItem('theme') || 'dark';
document.documentElement.setAttribute('data-theme', currentTheme);

themeBtn.addEventListener('click', () => {
  const theme = document.documentElement.getAttribute('data-theme');
  const newTheme = theme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
});

// ===== Custom Cursor =====
const cursorDot = document.querySelector('.cursor-dot');
const cursorRing = document.querySelector('.cursor-ring');
let mouseX = 0, mouseY = 0;
let dotX = 0, dotY = 0;
let ringX = 0, ringY = 0;

// Only enable custom cursor on non-touch devices
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

if (!isTouchDevice) {
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateCursor() {
    dotX += (mouseX - dotX) * 0.3;
    dotY += (mouseY - dotY) * 0.3;
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    
    cursorDot.style.left = dotX + 'px';
    cursorDot.style.top = dotY + 'px';
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top = ringY + 'px';
    
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Cursor hover effects
  const hoverElements = document.querySelectorAll('a, button, .project-card, .service-card, .tool-item');
  hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursorDot.classList.add('hovered');
      cursorRing.classList.add('hovered');
    });
    el.addEventListener('mouseleave', () => {
      cursorDot.classList.remove('hovered');
      cursorRing.classList.remove('hovered');
    });
  });
} else {
  // Hide cursor elements on touch devices
  cursorDot.style.display = 'none';
  cursorRing.style.display = 'none';
  document.body.style.cursor = 'auto';
}

// ===== Background Canvas =====
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles = [];
const particleCount = 80;

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.5;
    this.speedY = (Math.random() - 0.5) * 0.5;
    this.opacity = Math.random() * 0.5 + 0.2;
  }
  
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
    if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
  }
  
  draw() {
    ctx.fillStyle = `rgba(108, 99, 255, ${this.opacity})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

for (let i = 0; i < particleCount; i++) {
  particles.push(new Particle());
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(particle => {
    particle.update();
    particle.draw();
  });
  
  // Connect particles
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 120) {
        ctx.strokeStyle = `rgba(108, 99, 255, ${0.15 * (1 - distance / 120)})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }
  
  requestAnimationFrame(animateParticles);
}
animateParticles();

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

// ===== Header Scroll =====
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

// ===== Mobile Menu =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

// Close menu on link click
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// Close menu on outside click
document.addEventListener('click', (e) => {
  if (!navLinks.contains(e.target) && !hamburger.contains(e.target) && navLinks.classList.contains('open')) {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  }
});

// Prevent body scroll when menu is open on mobile
const body = document.body;
const observer = new MutationObserver(() => {
  if (navLinks.classList.contains('open') && window.innerWidth <= 768) {
    body.style.overflow = 'hidden';
  } else {
    body.style.overflow = '';
  }
});
observer.observe(navLinks, { attributes: true, attributeFilter: ['class'] });

// ===== Smooth Scroll & Active Nav =====
const sections = document.querySelectorAll('section[id]');
const navLinksAll = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  const scrollY = window.pageYOffset;
  
  sections.forEach(section => {
    const sectionHeight = section.offsetHeight;
    const sectionTop = section.offsetTop - 100;
    const sectionId = section.getAttribute('id');
    
    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
      navLinksAll.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === sectionId) {
          link.classList.add('active');
        }
      });
    }
  });
});

// ===== Reveal Animations =====
const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

revealElements.forEach(el => revealObserver.observe(el));

// ===== Counter Animation =====
const counters = document.querySelectorAll('[data-count]');
let counterAnimated = false;

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !counterAnimated) {
      counterAnimated = true;
      counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
          current += increment;
          if (current < target) {
            counter.textContent = Math.ceil(current);
            requestAnimationFrame(updateCounter);
          } else {
            counter.textContent = target;
          }
        };
        updateCounter();
      });
    }
  });
}, { threshold: 0.5 });

counters.forEach(counter => counterObserver.observe(counter));

// ===== Skills Animation =====
const skillBars = document.querySelectorAll('.skill-bar-item');
let skillsAnimated = false;

const skillsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !skillsAnimated) {
      skillsAnimated = true;
      skillBars.forEach(bar => {
        const skillValue = bar.getAttribute('data-skill');
        const fill = bar.querySelector('.skill-fill');
        fill.style.setProperty('--skill-width', skillValue + '%');
        bar.classList.add('animated');
      });
    }
  });
}, { threshold: 0.3 });

if (skillBars.length > 0) {
  skillsObserver.observe(skillBars[0]);
}

// ===== Project Filter =====
const filterBtns = document.querySelectorAll('.pf-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const filter = btn.getAttribute('data-filter');
    
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    projectCards.forEach(card => {
      const categories = card.getAttribute('data-category').split(' ');
      
      if (filter === 'all' || categories.includes(filter)) {
        card.style.display = 'block';
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, 10);
      } else {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
          card.style.display = 'none';
        }, 300);
      }
    });
  });
});

// ===== Testimonials Carousel =====
const testimonialCards = document.querySelectorAll('.testimonial-card');
const tPrev = document.getElementById('tPrev');
const tNext = document.getElementById('tNext');
const tDots = document.getElementById('tDots');
let currentTestimonial = 0;

// Create dots
testimonialCards.forEach((_, index) => {
  const dot = document.createElement('span');
  if (index === 0) dot.classList.add('active');
  dot.addEventListener('click', () => goToTestimonial(index));
  tDots.appendChild(dot);
});

const dots = tDots.querySelectorAll('span');

function goToTestimonial(index) {
  testimonialCards[currentTestimonial].classList.remove('active');
  dots[currentTestimonial].classList.remove('active');
  
  currentTestimonial = index;
  
  testimonialCards[currentTestimonial].classList.add('active');
  dots[currentTestimonial].classList.add('active');
}

tPrev.addEventListener('click', () => {
  const prev = currentTestimonial === 0 ? testimonialCards.length - 1 : currentTestimonial - 1;
  goToTestimonial(prev);
});

tNext.addEventListener('click', () => {
  const next = (currentTestimonial + 1) % testimonialCards.length;
  goToTestimonial(next);
});

// Auto-play
setInterval(() => {
  const next = (currentTestimonial + 1) % testimonialCards.length;
  goToTestimonial(next);
}, 5000);

// ===== Contact Form =====
const contactForm = document.getElementById('contactForm');
const toast = document.getElementById('toast');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  // Validate
  let isValid = true;
  const fields = contactForm.querySelectorAll('input, textarea');
  
  fields.forEach(field => {
    const formField = field.closest('.form-field');
    formField.classList.remove('error');
    
    if (field.hasAttribute('required') && !field.value.trim()) {
      formField.classList.add('error');
      isValid = false;
    } else if (field.type === 'email' && !isValidEmail(field.value)) {
      formField.classList.add('error');
      isValid = false;
    } else if (field.id === 'fmessage' && field.value.trim().length < 10) {
      formField.classList.add('error');
      isValid = false;
    }
  });
  
  if (isValid) {
    const submitBtn = contactForm.querySelector('.form-submit');
    const btnLabel = submitBtn.querySelector('.btn-label');
    
    submitBtn.disabled = true;
    btnLabel.textContent = 'Sending...';
    
    // Simulate sending
    setTimeout(() => {
      contactForm.reset();
      localStorage.removeItem('contactDraft');
      submitBtn.disabled = false;
      btnLabel.textContent = 'Send Message';
      console.log('Form submitted successfully!');
    }, 1500);
  }
});

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Save draft
contactForm.querySelectorAll('input, textarea').forEach(field => {
  field.addEventListener('input', () => {
    const formData = {
      name: contactForm.fname.value,
      email: contactForm.femail.value,
      subject: contactForm.fsubject.value,
      message: contactForm.fmessage.value
    };
    localStorage.setItem('contactDraft', JSON.stringify(formData));
  });
});

// Load draft
const draft = localStorage.getItem('contactDraft');
if (draft) {
  const data = JSON.parse(draft);
  contactForm.fname.value = data.name || '';
  contactForm.femail.value = data.email || '';
  contactForm.fsubject.value = data.subject || '';
  contactForm.fmessage.value = data.message || '';
}

// ===== Back to Top =====
const backTop = document.getElementById('backTop');

window.addEventListener('scroll', () => {
  if (window.scrollY > 300) {
    backTop.classList.add('visible');
  } else {
    backTop.classList.remove('visible');
  }
});

backTop.addEventListener('click', (e) => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===== Download CV =====
document.getElementById('downloadCV').addEventListener('click', (e) => {
  e.preventDefault();
  
  const cvContent = `
TAQVEEM - SENIOR WEB DEVELOPER
================================

CONTACT:
Email: Taqveemulhaq97@gmail.com
Phone: +92 301 8570942
Location: Peshawar, Pakistan
GitHub: github.com/Taqveem99
LinkedIn: linkedin.com/in/taqveem-ulhaq-1388a925a/

EXPERIENCE:
5+ years of professional web development experience

SKILLS:
- JavaScript/TypeScript (95%)
- React/Next.js (90%)
- Node.js/Express (85%)
- CSS/Tailwind/SASS (88%)
- MongoDB/PostgreSQL (80%)
- Git/CI/CD/Docker (82%)

SERVICES:
- Frontend Development
- Backend Development
- Responsive Design
- Performance Optimization

PROJECTS:
- E-Commerce Platform (React, Node.js, MongoDB)
- Analytics Dashboard (Next.js, D3.js, PostgreSQL)
- Task Manager PWA (Vanilla JS, CSS3, PWA)
- Social Media Platform (React, Firebase, Redux)
- Online Learning Platform (Next.js, AWS, PostgreSQL)
- Weather PWA (Vanilla JS, API, PWA)
`;
  
  const blob = new Blob([cvContent], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Taqveem_CV.txt';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  toast.querySelector('span').textContent = 'CV downloaded successfully!';
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
    toast.querySelector('span').textContent = 'Message sent successfully!';
  }, 3000);
});

// ===== Console Message =====
console.log('%c Welcome to Taqveem.Dev! ', 'background: #6c63ff; color: #fff; font-size: 16px; font-weight: bold; padding: 10px; border-radius: 5px;');
console.log('%c Interested in collaboration? Let\'s talk! ', 'background: #ff6584; color: #fff; font-size: 14px; padding: 8px; border-radius: 5px;');
