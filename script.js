/* ============================================
   AYADY&Co Landing Page - JavaScript
   Luxury Artisan Design
   ============================================ */

// ============================================
// FORM SUBMISSION HANDLER
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    const orderForm = document.getElementById('orderForm');
    
    if (orderForm) {
        orderForm.addEventListener('submit', function(e) {
            e.preventDefault();

alert("FORM WORKING");

            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const neighborhood = document.getElementById('neighborhood').value;
            const city = document.getElementById('city').value;
            const message = document.getElementById('message').value;

            // Validate form inputs
            if (!name || !email || !phone || !neighborhood || !city) {
                alert('الرجاء ملء جميع الحقول المطلوبة');
                return;
            }

            // Create WhatsApp message
            const whatsappNumber = '212644223229';
            const whatsappMessage = `السلام عليكم،\n\nاسمي: ${name}\nالبريد الإلكتروني: ${email}\nرقم الهاتف: ${phone}\nالحي/السكن: ${neighborhood}\nالمدينة: ${city}\n\nرسالتي:\n${message}\n\nأود طلب وسادة AYADY&Co بسعر 179 درهم مع التوصيل في جميع أنحاء المغرب.`;

            // Encode message for URL
            const encodedMessage = encodeURIComponent(whatsappMessage);
            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

            fetch("https://script.google.com/macros/s/AKfycbyQNiU1TMJPYmPZrqYKS_Rf11AALDeHQEoZTucf7Pn0B4yIlI2OTFdhjslRAjWbq7L5/exec", {
    method: "POST",
    headers: {
        "Content-Type": "text/plain;charset=utf-8"
    },
    body: JSON.stringify({
        name: name,
        email: email,
        phone: phone,
        address: neighborhood,
        city: city,
        notes: message
    })
})
.catch(error => console.error("Google Sheets Error:", error));

            // Open WhatsApp in new window
            window.open(whatsappUrl, '_blank');

            // Reset form after submission
            orderForm.reset();
            
            // Optional: Show success message
            showSuccessMessage();
        });
    }
});

// ============================================
// SMOOTH SCROLL FOR NAVIGATION LINKS
// ============================================

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

// ============================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// ============================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Apply animation to feature cards
document.querySelectorAll('.feature-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(card);
});

// ============================================
// SUCCESS MESSAGE FUNCTION
// ============================================

function showSuccessMessage() {
    // Create success message element
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = 'تم إرسال طلبك بنجاح! سيتم التواصل معك قريباً عبر الواتس آب.';
    
    // Add styles
    successDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #4CAF50;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
        font-family: 'Lora', serif;
    `;
    
    // Add to body
    document.body.appendChild(successDiv);
    
    // Remove after 5 seconds
    setTimeout(() => {
        successDiv.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            successDiv.remove();
        }, 300);
    }, 5000);
}

// ============================================
// ADD ANIMATION STYLES DYNAMICALLY
// ============================================

const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ============================================
// FORM INPUT VALIDATION
// ============================================

const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('phone');

if (emailInput) {
    emailInput.addEventListener('blur', function() {
        if (this.value && !isValidEmail(this.value)) {
            this.style.borderColor = '#D97706';
        } else {
            this.style.borderColor = '#E8E4E0';
        }
    });
}

if (phoneInput) {
    phoneInput.addEventListener('blur', function() {
        if (this.value && !isValidPhone(this.value)) {
            this.style.borderColor = '#D97706';
        } else {
            this.style.borderColor = '#E8E4E0';
        }
    });
}

// ============================================
// VALIDATION HELPER FUNCTIONS
// ============================================

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    // Moroccan phone number format: 06XXXXXXXX or +212XXXXXXXXX
    const phoneRegex = /^(06|212)[0-9]{8}$/;
    const cleanPhone = phone.replace(/\D/g, '');
    return phoneRegex.test(cleanPhone);
}

// ============================================
// HEADER STICKY BEHAVIOR
// ============================================

let lastScrollTop = 0;
const header = document.querySelector('header');

window.addEventListener('scroll', function() {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > 100) {
        header.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
    } else {
        header.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
    }
    
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
});

// ============================================
// MOBILE MENU TOGGLE (if needed in future)
// ============================================

function initMobileMenu() {
    // This function can be expanded to add mobile menu functionality
    // Currently, the navigation is hidden on mobile via CSS
}

// ============================================
// LAZY LOADING FOR IMAGES
// ============================================

if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Debounce function for performance optimization
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

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ============================================
// CONSOLE LOG FOR DEBUGGING
// ============================================

console.log('AYADY&Co Landing Page Loaded Successfully');
console.log('WhatsApp Integration: Active');
console.log('Form Validation: Active');
console.log('Smooth Scroll: Active');
