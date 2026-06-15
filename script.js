   // Google Apps Script URL - استبدل هذا برابطك من Google Apps Script
        const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyQNiU1TMJPYmPZrqYKS_Rf11AALDeHQEoZTucf7Pn0B4yIlI2OTFdhjslRAjWbq7L5/exec';

        let selectedPackage = null;

        // Select Package Function
        function selectPackage(element) {
            // Remove previous selection
            document.querySelectorAll('.package-card').forEach(card => {
                card.classList.remove('selected');
            });

            // Add selection to clicked card
            element.classList.add('selected');

            // Store package data
            selectedPackage = {
                name: element.dataset.package,
                price: element.dataset.price
            };

            // Update form with package data
            document.getElementById('packageInput').value = selectedPackage.name;
            document.getElementById('priceInput').value = selectedPackage.price;

            // Show selected package display
            const display = document.getElementById('selectedPackageDisplay');
            document.getElementById('packageName').textContent = `${selectedPackage.name} - ${selectedPackage.price} درهم`;
            display.style.display = 'block';

            // Scroll to form
            document.getElementById('order').scrollIntoView({ behavior: 'smooth' });
        }

        // Form Submission
        document.addEventListener('DOMContentLoaded', function() {
            const orderForm = document.getElementById('orderForm');
            
            if (orderForm) {
                orderForm.addEventListener('submit', function(e) {
                    e.preventDefault();

                    // Clear previous errors
                    document.querySelectorAll('.form-group').forEach(group => {
                        group.classList.remove('error');
                    });

                    // Get form values
                    const name = document.getElementById('name').value.trim();
                    const email = document.getElementById('email').value.trim();
                    const phone = document.getElementById('phone').value.trim();
                    const neighborhood = document.getElementById('neighborhood').value.trim();
                    const city = document.getElementById('city').value.trim();
                    const message = document.getElementById('message').value.trim();
                    const packageName = document.getElementById('packageInput').value;
                    const price = document.getElementById('priceInput').value;

                    // Validation
                    let isValid = true;

                    // Check required fields
                    if (!name) {
                        showFieldError('name');
                        isValid = false;
                    }

                    if (!phone) {
                        showFieldError('phone');
                        isValid = false;
                    } else if (!isValidPhone(phone)) {
                        showFieldError('phone');
                        isValid = false;
                    }

                    if (!neighborhood) {
                        showFieldError('neighborhood');
                        isValid = false;
                    }

                    if (!city) {
                        showFieldError('city');
                        isValid = false;
                    }

                    // Check email if provided
                    if (email && !isValidEmail(email)) {
                        showFieldError('email');
                        isValid = false;
                    }

                    // Check if package is selected
                    if (!packageName) {
                        alert('الرجاء اختيار باقة قبل الإرسال');
                        isValid = false;
                    }

                    if (!isValid) {
                        return;
                    }

                    // Prepare data for Google Sheets
                    const formData = {
                        name: name,
                        email: email || 'غير مدرج',
                        phone: phone,
                        neighborhood: neighborhood,
                        city: city,
                        message: `${message}\n\nالباقة: ${packageName} - ${price} درهم`,
                        package: packageName,
                        price: price
                    };

                    // Show loading message
                    const submitBtn = document.querySelector('.submit-btn');
                    const originalText = submitBtn.textContent;
                    submitBtn.textContent = 'جاري الإرسال...';
                    submitBtn.disabled = true;

                    // Send data to Google Sheets
                    fetch(GOOGLE_SCRIPT_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(formData)
})
.then(() => {

    showConfirmationModal();

    orderForm.reset();

    document.querySelectorAll('.package-card').forEach(card => {
        card.classList.remove('selected');
    });

    document.getElementById('selectedPackageDisplay').style.display = 'none';

    selectedPackage = null;

})
.catch(error => {
    console.error(error);
    showErrorMessage('خطأ في الاتصال');
})
                         
                        submitBtn.textContent = originalText;
                        submitBtn.disabled = false;
                    });
                ;
            
        

        // Show field error
        function showFieldError(fieldId) {
            const field = document.getElementById(fieldId);
            field.parentElement.classList.add('error');
        }

        // Validation functions
        function isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        }

        function isValidPhone(phone) {
            // Moroccan phone number format: 06XXXXXXXX or +212XXXXXXXXX
            const phoneRegex = /^(06|212)[0-9]{8}$/;
            const cleanPhone = phone.replace(/\D/g, '');
            return cleanPhone.length === 10 && phoneRegex.test(cleanPhone);
        }

        // Show confirmation modal
        function showConfirmationModal() {
            document.getElementById('confirmationModal').classList.add('show');
        }

        // Close modal
        function closeModal() {
            document.getElementById('confirmationModal').classList.remove('show');
        }

        // Show error message
        function showErrorMessage(message) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.textContent = message;
            
            errorDiv.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background-color: #f44336;
                color: white;
                padding: 1rem 1.5rem;
                border-radius: 0.5rem;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                z-index: 1000;
                animation: slideIn 0.3s ease-out;
                font-family: 'Lora', serif;
            `;
            
            document.body.appendChild(errorDiv);
            
            setTimeout(() => {
                errorDiv.style.animation = 'slideOut 0.3s ease-out';
                setTimeout(() => {
                    errorDiv.remove();
                }, 300);
            }, 5000);
        }

        // Smooth scroll for navigation links
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

        // Intersection Observer for animations
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

        document.querySelectorAll('.feature-card, .package-card').forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            observer.observe(card);
        });

        // Close modal when clicking outside
        window.addEventListener('click', function(event) {
            const modal = document.getElementById('confirmationModal');
            if (event.target == modal) {
                closeModal();
            }
        });
