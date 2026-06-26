/**
 * MS Refrigeración - Main JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initContactForm();
  initActiveLink();
});

/**
 * Initialize Mobile Navigation hamburger toggle
 */
function initMobileMenu() {
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.contains('open');
      if (isOpen) {
        navMenu.classList.remove('open');
        navToggle.classList.remove('open');
        document.body.style.overflow = '';
      } else {
        navMenu.classList.add('open');
        navToggle.classList.add('open');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
      }
    });

    // Close menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        navToggle.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }
}

/**
 * Handles Web3Forms AJAX submission for the contact form
 */
function initContactForm() {
  const contactForm = document.getElementById('contact-form');
  const formResponse = document.getElementById('form-response');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Show submitting state
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Enviando...';

      if (formResponse) {
        formResponse.style.display = 'none';
        formResponse.className = '';
      }

      const formData = new FormData(contactForm);
      
      // Web3Forms endpoint config
      // Note: We use Web3Forms API which processes FormData directly
      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: formData
        });

        const result = await response.json();

        if (response.status === 200 && result.success) {
          showFormMessage('¡Muchas gracias! Tu mensaje ha sido enviado con éxito. Nos pondremos en contacto a la brevedad.', 'success');
          contactForm.reset();
        } else {
          showFormMessage('Hubo un problema al enviar tu consulta: ' + (result.message || 'Error desconocido') + '. Por favor, intentalo de nuevo más tarde.', 'error');
        }
      } catch (error) {
        showFormMessage('Error de red. Por favor, verificá tu conexión a internet e intentalo de nuevo.', 'error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
      }
    });
  }

  function showFormMessage(message, type) {
    if (formResponse) {
      formResponse.style.display = 'block';
      formResponse.innerHTML = message;
      formResponse.style.padding = '1rem';
      formResponse.style.borderRadius = '4px';
      formResponse.style.marginTop = '1rem';
      formResponse.style.fontWeight = '500';
      formResponse.style.fontSize = '0.95rem';
      
      if (type === 'success') {
        formResponse.style.backgroundColor = '#d4edda';
        formResponse.style.color = '#155724';
        formResponse.style.border = '1px solid #c3e6cb';
      } else {
        formResponse.style.backgroundColor = '#f8d7da';
        formResponse.style.color = '#721c24';
        formResponse.style.border = '1px solid #f5c6cb';
      }
    }
  }
}

/**
 * Marks the active navigation link based on current path
 */
function initActiveLink() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    // Simple check if path matches href (accounting for index/home)
    if (currentPath.endsWith(href) || (href === 'index.html' && (currentPath.endsWith('/') || currentPath === ''))) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}
