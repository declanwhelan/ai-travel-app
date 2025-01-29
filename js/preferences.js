document.addEventListener('DOMContentLoaded', function() {
    // Initialize date pickers
    flatpickr("#startDate", {
        minDate: "today",
        dateFormat: "Y-m-d",
        onChange: function(selectedDates) {
            endDatePicker.set("minDate", selectedDates[0]);
        }
    });

    const endDatePicker = flatpickr("#endDate", {
        dateFormat: "Y-m-d"
    });

    // Form navigation
    const sections = document.querySelectorAll('.form-section');
    const progress = document.getElementById('formProgress');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');
    let currentSection = 0;

    function updateProgress() {
        const progressPercentage = ((currentSection + 1) / sections.length) * 100;
        progress.style.width = `${progressPercentage}%`;
    }

    function showSection(index) {
        sections.forEach(section => section.classList.remove('active'));
        sections[index].classList.add('active');
        
        // Update buttons
        prevBtn.disabled = index === 0;
        if (index === sections.length - 1) {
            nextBtn.style.display = 'none';
            submitBtn.style.display = 'block';
        } else {
            nextBtn.style.display = 'block';
            submitBtn.style.display = 'none';
        }
        
        updateProgress();
    }

    nextBtn.addEventListener('click', () => {
        if (currentSection < sections.length - 1) {
            currentSection++;
            showSection(currentSection);
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentSection > 0) {
            currentSection--;
            showSection(currentSection);
        }
    });

    // Form submission
    document.getElementById('preferencesForm').addEventListener('submit', function(e) {
        e.preventDefault();
        // Collect form data and submit
        const formData = new FormData(this);
        // Add your form submission logic here
        console.log('Form submitted');
    });

    // Initialize first section
    showSection(0);
});

document.addEventListener('DOMContentLoaded', function() {
    // ... existing code ...
    const destinationInput = document.getElementById('destination');
    if (destinationInput) {
        new Autocomplete(destinationInput, destinations);
    }
    // Handle interest item selection
    const interestItems = document.querySelectorAll('.interest-item');
    
    interestItems.forEach(item => {
        item.addEventListener('click', function() {
            const checkbox = this.querySelector('input[type="checkbox"]');
            const wasChecked = checkbox.checked;
            
            // Toggle checkbox
            checkbox.checked = !wasChecked;
            
            // Toggle selected class
            this.classList.toggle('selected', !wasChecked);
            
            // Optional: Add a subtle animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 100);
        });
    });
});
document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('.form-section');
    const progress = document.getElementById('formProgress');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');
    let currentSection = 0;
    
    // Track touched fields instead of sections
    let touchedFields = new Set();

    function highlightError(error) {
    // Add error highlight class to the element
    const element = document.getElementById(error);
    if (element) {
        element.classList.add('error');
        
        // Create error message element if it doesn't exist
        let errorMsg = element.nextElementSibling;
        if (!errorMsg || !errorMsg.classList.contains('error-message')) {
            errorMsg = document.createElement('div');
            errorMsg.classList.add('error-message');
            element.parentNode.insertBefore(errorMsg, element.nextSibling);
        }
        
        // Set error message text
        errorMsg.textContent = `Please fill out this field`;
        
        // Remove error styling after user interaction
        element.addEventListener('input', function() {
            element.classList.remove('error');
            if (errorMsg) {
                errorMsg.remove();
            }
        }, { once: true });
    }
    }

    // Validation rules for each section
    const validationRules = {
        0: function() { // Destination and Dates
            const destination = document.getElementById('destination');
            const startDate = document.getElementById('startDate');
            const endDate = document.getElementById('endDate');
            
            let isValid = true;
            let errorMessages = [];

            if (touchedFields.has('destination') && !destination.value.trim()) {
                errorMessages.push('Please select a destination');
                isValid = false;
                highlightError('destination');
            }
            
            if (touchedFields.has('startDate') && !startDate.value) {
                errorMessages.push('Please select a start date');
                isValid = false;
                highlightError('startDate');
            }
            
            if (touchedFields.has('endDate') && !endDate.value) {
                errorMessages.push('Please select an end date');
                isValid = false;
                highlightError('endDate');
            }

            if (errorMessages.length > 0) {
                showErrors(errorMessages);
            }
            
            // Check all fields for button state, but don't show errors
            return destination.value.trim() && startDate.value && endDate.value;
        },
        1: function() { // Interests
            const selectedInterests = document.querySelectorAll('.interest-item input:checked');
            
            if (touchedFields.has('interests') && selectedInterests.length === 0) {
                showErrors(['Please select at least one interest']);
                highlightError('interests-grid');
                return false;
            }
            return selectedInterests.length > 0;
        },
        2: function() { // Travel Style
            const pace = document.querySelector('input[name="pace"]:checked');
            const transport = document.querySelector('input[name="transport"]:checked');
            const accommodation = document.querySelector('input[name="accommodation"]:checked');
            
            let errorMessages = [];

            if (touchedFields.has('pace') && !pace) {
                errorMessages.push('Please select your preferred travel pace');
                highlightError('pace-options');
            }
            
            if (touchedFields.has('transport') && !transport) {
                errorMessages.push('Please select your preferred mode of transportation');
                highlightError('transport-options');
            }
            
            if (touchedFields.has('accommodation') && !accommodation) {
                errorMessages.push('Please select your accommodation preference');
                highlightError('accommodation-options');
            }

            if (errorMessages.length > 0) {
                showErrors(errorMessages);
            }

            return pace && transport && accommodation;
        }
    };

    function markFieldAsTouched(fieldId) {
        touchedFields.add(fieldId);
        validateCurrentSection();
    }

    // Add input listeners for real-time validation
    function addValidationListeners() {
        const currentSectionElement = sections[currentSection];

        // For destination and dates
        if (currentSection === 0) {
            ['destination', 'startDate', 'endDate'].forEach(fieldId => {
                const field = document.getElementById(fieldId);
                if (field) {
                    field.addEventListener('blur', () => markFieldAsTouched(fieldId));
                    field.addEventListener('change', () => validateCurrentSection());
                }
            });
        }

        // For interests
        if (currentSection === 1) {
            const interestItems = currentSectionElement.querySelectorAll('.interest-item');
            interestItems.forEach(item => {
                item.addEventListener('click', () => {
                    markFieldAsTouched('interests');
                    validateCurrentSection();
                });
            });
        }

        // For travel style
        if (currentSection === 2) {
            ['pace', 'transport', 'accommodation'].forEach(fieldId => {
                const options = currentSectionElement.querySelectorAll(`input[name="${fieldId}"]`);
                options.forEach(option => {
                    option.addEventListener('change', () => {
                        markFieldAsTouched(fieldId);
                        validateCurrentSection();
                    });
                });
            });
        }
    }

    function showErrors(messages) {
        removeErrors();
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'form-error';
        errorDiv.innerHTML = messages.join('<br>');
        
        const currentSectionElement = sections[currentSection];
        currentSectionElement.insertBefore(errorDiv, currentSectionElement.firstChild);
    }

    function removeErrors() {
        const existingErrors = document.querySelectorAll('.form-error');
        existingErrors.forEach(error => error.remove());
        
        document.querySelectorAll('.error-highlight').forEach(el => {
            el.classList.remove('error-highlight');
        });
    }

    function validateCurrentSection() {
        const isValid = validationRules[currentSection]();
        nextBtn.disabled = !isValid;
        submitBtn.disabled = !isValid;
        return isValid;
    }

    // Navigation functions
    function showSection(index) {
        removeErrors();
        sections.forEach(section => section.classList.remove('active'));
        sections[index].classList.add('active');
        
        currentSection = index;
        
        // Update buttons
        prevBtn.disabled = index === 0;
        if (index === sections.length - 1) {
            nextBtn.style.display = 'none';
            submitBtn.style.display = 'block';
        } else {
            nextBtn.style.display = 'block';
            submitBtn.style.display = 'none';
        }
        
        validateCurrentSection();
        addValidationListeners();
    }

    // Event listeners
    nextBtn.addEventListener('click', () => {
        // Mark all fields in current section as touched when trying to proceed
        const currentSectionElement = sections[currentSection];
        currentSectionElement.querySelectorAll('input').forEach(input => {
            markFieldAsTouched(input.name || input.id);
        });
        
        if (validateCurrentSection() && currentSection < sections.length - 1) {
            showSection(currentSection + 1);
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentSection > 0) {
            showSection(currentSection - 1);
        }
    });

    // Initialize first section
    showSection(0);
});

