document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // --- INITIATE SCROLL ANIMATION OBSERVER ---
  const scrollElements = document.querySelectorAll('.scroll-animate');
  
  const elementInView = (el, dividend = 1) => {
    const elementTop = el.getBoundingClientRect().top;
    return (
      elementTop <= (window.innerHeight || document.documentElement.clientHeight) / dividend
    );
  };
  
  const displayScrollElement = (element) => {
    element.classList.add('visible');
  };
  
  const handleScrollAnimation = () => {
    scrollElements.forEach((el) => {
      if (elementInView(el, 1.1)) {
        displayScrollElement(el);
      }
    });
  };

  // Run on load
  setTimeout(handleScrollAnimation, 150);
  
  // Run on scroll with simple throttle
  let scrollTimeout;
  window.addEventListener('scroll', () => {
    if (scrollTimeout) return;
    scrollTimeout = setTimeout(() => {
      handleScrollAnimation();
      scrollTimeout = null;
    }, 50);
  });


  // --- SERVICES TAB SWITCHER ---
  const tabButtons = document.querySelectorAll('.service-tab');
  const serviceCards = document.querySelectorAll('.service-card-item');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active from all tabs
      tabButtons.forEach(btn => btn.classList.remove('active'));
      // Add active to current
      button.classList.add('active');

      const selectedCategory = button.getAttribute('data-category');

      serviceCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        
        if (selectedCategory === 'all' || cardCategory === selectedCategory) {
          card.style.display = 'block';
          // Trigger slight fade-in effect
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });


  // --- DYNAMIC BOOKING MODAL & WHATSAPP LOGIC ---
  const modal = document.getElementById('booking-modal');
  const modalCloseBtn = document.getElementById('close-modal');
  const bookBtns = document.querySelectorAll('.btn-trigger-booking');
  const bookingForm = document.getElementById('modal-booking-form');
  const serviceSelect = document.getElementById('modal-service');

  // Open modal handler
  const openBookingModal = (defaultService = '') => {
    if (modal) {
      modal.classList.remove('hidden');
      modal.classList.add('flex');
      document.body.style.overflow = 'hidden'; // prevent background scroll
      
      if (defaultService && serviceSelect) {
        // Find option that matches or contains defaultService
        for (let i = 0; i < serviceSelect.options.length; i++) {
          if (serviceSelect.options[i].value.toLowerCase().includes(defaultService.toLowerCase()) || 
              defaultService.toLowerCase().includes(serviceSelect.options[i].value.toLowerCase())) {
            serviceSelect.selectedIndex = i;
            break;
          }
        }
      }
    }
  };

  // Attach click to all booking buttons
  bookBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const serviceName = btn.getAttribute('data-service') || '';
      openBookingModal(serviceName);
    });
  });

  // Close modal handler
  const closeBookingModal = () => {
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
      document.body.style.overflow = 'auto'; // restore scroll
    }
  };

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeBookingModal);
  }

  // Click outside modal content to close
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeBookingModal();
      }
    });
  }

  // Form Submission
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('modal-name').value.trim();
      const phone = document.getElementById('modal-phone').value.trim();
      const service = document.getElementById('modal-service').value;
      const date = document.getElementById('modal-date').value;
      const time = document.getElementById('modal-time').value;
      const note = document.getElementById('modal-notes').value.trim();

      // Formulate WhatsApp message text
      let text = `Hello Kashish Beauty Parlour, I would like to book a luxury appointment.\n\n`;
      text += `✨ *Booking Details* ✨\n`;
      text += `👤 *Name:* ${name}\n`;
      text += `📞 *Phone:* ${phone}\n`;
      text += `🌸 *Treatment/Service:* ${service}\n`;
      text += `📅 *Date:* ${date}\n`;
      text += `⏰ *Preferred Time:* ${time}\n`;
      
      if (note) {
        text += `📝 *Special Request:* ${note}\n`;
      }
      
      text += `\nThank you! Looking forward to my luxurious beauty experience.`;

      // WhatsApp link (using Pakistani format: 923138261779)
      const whatsappURL = `https://wa.me/923138261779?text=${encodeURIComponent(text)}`;
      
      // Open WhatsApp in new window
      window.open(whatsappURL, '_blank');
      
      // Close modal & reset form
      closeBookingModal();
      bookingForm.reset();
    });
  }


  // --- CONTACT SECTION FORM ---
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const clientName = document.getElementById('contact-name').value.trim();
      const clientEmail = document.getElementById('contact-email').value.trim();
      const clientService = document.getElementById('contact-service').value;
      const clientMsg = document.getElementById('contact-message').value.trim();

      let text = `Hello Kashish Beauty Parlour,\n`;
      text += `I have a general inquiry from your luxury website:\n\n`;
      text += `👤 *Name:* ${clientName}\n`;
      text += `📧 *Email:* ${clientEmail}\n`;
      text += `🌸 *Interested In:* ${clientService}\n`;
      text += `💬 *Message:* ${clientMsg}\n`;

      const whatsappURL = `https://wa.me/923138261779?text=${encodeURIComponent(text)}`;
      window.open(whatsappURL, '_blank');
      contactForm.reset();
    });
  }

  // Set default minimum date to today for booking
  const dateInput = document.getElementById('modal-date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }
});
