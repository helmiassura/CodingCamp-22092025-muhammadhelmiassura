document.addEventListener('DOMContentLoaded', function () {
  initializeApp();
});

function initializeApp() {
  setupNavigation();
  setupWelcomeMessage();
  setupFormValidation();
  setupScrollEffects();
  setupModalFunctionality();
  setupInteractiveFeatures();
  lazyLoadImages();
}

// Navigation functionality
function setupNavigation() {
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', function () {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
    });
  }

  navLinks.forEach(link => {
    link.addEventListener('click', function () {
      if (hamburger && navMenu) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
      }

      navLinks.forEach(l => l.classList.remove('active'));
      this.classList.add('active');
    });
  });

  window.addEventListener('scroll', updateActiveNavLink);
}

function updateActiveNavLink() {
  // const sections = document.querySelectorAll('section');
  // const navLinks = document.querySelectorAll('.nav-link');

  // let current = '';
  // sections.forEach(section => {
  //   const sectionTop = section.offsetTop;
  //   const sectionHeight = section.clientHeight;
  //   if (scrollY >= (sectionTop - 200)) {
  //     current = section.getAttribute('id');
  //   }
  // });

  // navLinks.forEach(link => {
  //   link.classList.remove('active');
  //   if (link.getAttribute('href') && link.getAttribute('href').substring(1) === current) {
  //     link.classList.add('active');
  //   }
  // });
  return;
}

function setupWelcomeMessage() {
  const welcomeText = document.getElementById('welcomeText');

  const storedUserName = sessionStorage.getItem('userName');

  if (storedUserName) {
    if (welcomeText) welcomeText.textContent = `Hi ${storedUserName}, Welcome To Website`;
    return;
  }

  setTimeout(() => {
    if (typeof Swal !== 'undefined') {
      Swal.fire({
        title: 'Welcome!',
        text: 'What is your name?',
        input: 'text',
        inputPlaceholder: 'Enter your name',
        showCancelButton: true,
        confirmButtonText: 'OK',
        cancelButtonText: 'Skip'
      }).then((result) => {
        if (result.isConfirmed && result.value.trim() !== '') {
          const userName = result.value.trim();
          if (welcomeText) welcomeText.textContent = `Hi ${userName}, Welcome To Website`;
          sessionStorage.setItem('userName', userName);
        } else {
          if (welcomeText) welcomeText.textContent = 'Hi Guest, Welcome To Website';
          sessionStorage.setItem('userName', 'Guest'); // Store Guest as well
        }
      });
    } else {
      const userName = prompt('Welcome! What is your name?');
      if (userName && userName.trim() !== '') {
        if (welcomeText) welcomeText.textContent = `Hi ${userName.trim()}, Welcome To Website`;
        sessionStorage.setItem('userName', userName.trim());
      } else {
        if (welcomeText) welcomeText.textContent = 'Hi Guest, Welcome To Website';
        sessionStorage.setItem('userName', 'Guest'); // Store Guest as well
      }
    }
  }, 1000);
}

// Form validation functionality
function setupFormValidation() {
  const form = document.getElementById('messageForm');
  if (!form) return;

  const inputs = form.querySelectorAll('input, textarea');

  inputs.forEach(input => {
    input.addEventListener('blur', function () {
      validateField(this);
    });

    input.addEventListener('input', function () {
      clearError(this);
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    submitForm();
  });
}

function validateField(field) {
  const value = field.value.trim();
  const fieldName = field.name;
  const errorElement = document.getElementById(fieldName + 'Error');
  let isValid = true;
  let errorMessage = '';

  clearError(field);

  if (field.hasAttribute('required') && value === '') {
    errorMessage = `${getFieldLabel(fieldName)} wajib diisi!`;
    isValid = false;
  }
  else if (fieldName === 'name' && value !== '') {
    if (value.length < 2) {
      errorMessage = 'Nama minimal 2 karakter!';
      isValid = false;
    }
  }
  else if (fieldName === 'message' && value !== '') {
    if (value.length < 10) {
      errorMessage = 'Pesan minimal 10 karakter!';
      isValid = false;
    }
  }

  if (!isValid) {
    showError(field, errorMessage);
  }

  return isValid;
}

function validateGender() {
  const genderOptions = document.querySelectorAll('input[name="gender"]');
  const genderError = document.getElementById('genderError');
  let isSelected = false;

  genderError.textContent = '';

  genderOptions.forEach(option => {
    if (option.checked) {
      isSelected = true;
    }
  });

  if (!isSelected) {
    genderError.textContent = 'Pilih jenis kelamin';
  }

  return isSelected;
}

function showError(field, message) {
  field.classList.add('error');
  const errorElement = document.getElementById(field.name + 'Error');
  if (errorElement) {
    errorElement.textContent = message;
  }
}

function clearError(field) {
  field.classList.remove('error');
  const errorElement = document.getElementById(field.name + 'Error');
  if (errorElement) {
    errorElement.textContent = '';
  }
}

function getFieldLabel(fieldName) {
  const labels = {
    'name': 'Nama',
    'birthdate': 'Tanggal Lahir',
    'gender': 'Jenis Kelamin',
    'message': 'Pesan'
  };
  return labels[fieldName] || fieldName;
}

function submitForm() {
  const form = document.getElementById('messageForm');
  const submitButton = form.querySelector('button[type="submit"]');
  const inputs = form.querySelectorAll('input, textarea');

  // Validate all fields
  let isFormValid = true;
  inputs.forEach(input => {
    if (!validateField(input)) {
      isFormValid = false;
    }
  });

  if (!isFormValid) {
    return;
  }

  // Show loading state
  submitButton.classList.add('loading');
  const originalText = submitButton.innerHTML;
  submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengirim...';
  submitButton.disabled = true;

  // Collect form data
  const formData = new FormData(form);
  const submitData = {};

  for (let [key, value] of formData.entries()) {
    submitData[key] = value;
  }

  setTimeout(() => {
    showSubmissionResult(submitData);

    form.reset();

    submitButton.classList.remove('loading');
    submitButton.innerHTML = originalText;
    submitButton.disabled = false;
  }, 2000);
}

function showSubmissionResult(data) {
  const modal = document.getElementById('submitModal');
  const resultDiv = document.getElementById('submitResult');

  let resultHTML = '<h4 style="color: #049458ff; margin-bottom: 1rem;">✓ Pesan Berhasil Dikirim!</h4>';
  resultHTML += '<p style="margin-bottom: 2rem; color: black;">Berikut detail yang Anda kirimkan:</p>';

  for (let [key, value] of Object.entries(data)) {
    if (value.trim() !== '') {
      resultHTML += `
                        <div class="result-item">
                            <div class="result-label">${getFieldLabel(key)}:</div>
                            <div class="result-value">${value}</div>
                        </div>
                    `;
    }
  }

  resultHTML += '<p style="margin-top: 2rem; color: black; font-size: 0.9rem;">Kami akan menghubungi Anda dalam 24 jam.</p>';

  resultDiv.innerHTML = resultHTML;
  modal.style.display = 'block';
}

// Modal functionality
function setupModalFunctionality() {
  const modal = document.getElementById('submitModal');
  if (!modal) return;

  const closeBtn = modal.querySelector('.close');

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  window.addEventListener('click', function (event) {
    if (event.target === modal) {
      closeModal();
    }
  });
}

function closeModal() {
  const modal = document.getElementById('submitModal');
  if (modal) {
    modal.style.display = 'none';
  }
}

// Scroll effects
function setupScrollEffects() {
  window.scrollToSection = function (sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  window.addEventListener('scroll', function () {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
      if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
      } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
      }
    }
  });

  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
      }
    });
  }, observerOptions);

  const animateElements = document.querySelectorAll('.service-card, .value-item, .floating-card, .contact-item, .contact-form');
  animateElements.forEach(el => {
    observer.observe(el);
  });
}

// Interactive features
function setupInteractiveFeatures() {
  const cards = document.querySelectorAll('.service-card, .value-item, .floating-card, .contact-item');
  cards.forEach(card => {
    card.addEventListener('mouseenter', function () {
      this.style.transform = 'translateY(-10px) scale(1.02)';
    });

    card.addEventListener('mouseleave', function () {
      this.style.transform = 'translateY(0) scale(1)';
    });
  });

  const heroTitle = document.querySelector('.hero-title, .section-title h2');
  if (heroTitle) {
    const originalText = heroTitle.textContent;
    heroTitle.textContent = '';
    let i = 0;

    function typeWriter() {
      if (i < originalText.length) {
        heroTitle.textContent += originalText.charAt(i);
        i++;
        setTimeout(typeWriter, 50);
      }
    }

    setTimeout(typeWriter, 1500);
  }

  // Add input focus effects
  document.querySelectorAll('input, textarea').forEach(input => {
    input.addEventListener('focus', function () {
      this.style.transform = 'translateY(-2px)';
    });

    input.addEventListener('blur', function () {
      this.style.transform = 'translateY(0)';
    });
  });
}

// Copy to clipboard function
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    showNotification('Disalin ke clipboard: ' + text);
  });
}

function showNotification(message) {
  const notification = document.createElement('div');
  notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(135deg, #4CAF50, #45a049);
                color: white;
                padding: 15px 25px;
                border-radius: 12px;
                z-index: 1000;
                font-weight: 500;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                transform: translateX(100%);
                transition: transform 0.3s ease;
            `;
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => notification.style.transform = 'translateX(0)', 100);
  setTimeout(() => {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => document.body.removeChild(notification), 300);
  }, 3000);
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function lazyLoadImages() {
  const images = document.querySelectorAll('img[data-src]');
  if (images.length === 0) return;

  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove('lazy');
        imageObserver.unobserve(img);
      }
    });
  });

  images.forEach(img => imageObserver.observe(img));
}

// Parallax effect for floating elements
document.addEventListener('mousemove', debounce((e) => {
  const elements = document.querySelectorAll('.floating-element');
  const x = e.clientX / window.innerWidth;
  const y = e.clientY / window.innerHeight;

  elements.forEach((element, index) => {
    const speed = (index + 1) * 0.5;
    const xMove = (x - 0.5) * speed * 20;
    const yMove = (y - 0.5) * speed * 20;
    element.style.transform = `translate(${xMove}px, ${yMove}px)`;
  });
}, 10));

window.addEventListener('error', function (e) {
  console.log('An error occurred:', e.error);
});

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    closeModal();
  }
});

window.addEventListener('load', function () {
  setupWelcomeMessage();
});

// Portfolio Page
const filterButtons = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');

if (filterButtons.length > 0) {
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const filterValue = button.getAttribute('data-filter');

      portfolioItems.forEach(item => {
        if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
          item.style.display = 'block';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 100);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.8)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Animation on scroll for portfolio items
if (portfolioItems.length > 0) {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  // Observe portfolio items
  portfolioItems.forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(20px)';
    item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(item);
  });
}

// slide background
document.addEventListener('DOMContentLoaded', function () {
  const slides = document.querySelectorAll('.slide');
  const indicators = document.querySelectorAll('.indicator');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  let currentSlide = 0;
  let slideInterval;

  // Initialize slideshow
  function initSlideshow() {
    showSlide(currentSlide);
    startAutoSlide();
  }

  // Show specific slide
  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });
    indicators.forEach((indicator, i) => {
      indicator.classList.toggle('active', i === index);
    });
  }


  function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  }

  function prevSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(currentSlide);
  }

  function startAutoSlide() {
    slideInterval = setTimeout(() => {
      nextSlide();
      slideInterval = setInterval(nextSlide, 5000);
    }, 3000);
  }

  function stopAutoSlide() {
    clearTimeout(slideInterval);
    clearInterval(slideInterval);
  }

  function restartAutoSlide() {
    stopAutoSlide();
    startAutoSlide();
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      restartAutoSlide();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevSlide();
      restartAutoSlide();
    });
  }

  indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
      currentSlide = index;
      showSlide(currentSlide);
      restartAutoSlide();
    });
  });

  const heroSection = document.querySelector('.hero');
  if (heroSection) {
    heroSection.addEventListener('mouseenter', stopAutoSlide);
    heroSection.addEventListener('mouseleave', startAutoSlide);
  }

  if (slides.length > 0) {
    initSlideshow();
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      prevSlide();
      restartAutoSlide();
    } else if (e.key === 'ArrowRight') {
      nextSlide();
      restartAutoSlide();
    }
  });
});