// ===================================
// Forms Management - Jarurat Care
// ===================================

let currentStep = 1;
let formData = {};
let autoSaveTimer = null;

// === Initialize Form ===
document.addEventListener('DOMContentLoaded', function() {
    const patientForm = document.getElementById('patientForm');
    const volunteerForm = document.getElementById('volunteerForm');
    const contactForm = document.getElementById('contactForm');
    
    if (patientForm) {
        // Clear any pre-filled test data from localStorage for fresh start
        clearTestFormData('patient');
        initializePatientForm();
    }
    
    if (volunteerForm) {
        clearTestFormData('volunteer');
        initializeVolunteerForm();
    }
    
    if (contactForm) {
        initializeContactForm();
    }
});

// === Clear test/demo data from form localStorage ===
function clearTestFormData(formType) {
    // Remove saved form data to ensure fresh start
    localStorage.removeItem(`${formType}FormData`);
}

// === Patient Form Initialization ===
function initializePatientForm() {
    const form = document.getElementById('patientForm');
    
    // Don't load saved data - start with clean form
    // loadFormData('patient');
    
    // Auto-save on input
    form.addEventListener('input', function() {
        clearTimeout(autoSaveTimer);
        autoSaveTimer = setTimeout(() => {
            autoSaveFormData('patient');
        }, 1000);
    });
    
    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        submitPatientForm();
    });
}

// === Volunteer Form Initialization ===
function initializeVolunteerForm() {
    const form = document.getElementById('volunteerForm');
    
    // Don't load saved data - start with clean form
    // loadFormData('volunteer');
    
    form.addEventListener('input', function() {
        clearTimeout(autoSaveTimer);
        autoSaveTimer = setTimeout(() => {
            autoSaveFormData('volunteer');
        }, 1000);
    });
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        submitVolunteerForm();
    });
}

// === Contact Form Initialization ===
function initializeContactForm() {
    const form = document.getElementById('contactForm');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        submitContactForm();
    });
}

// === Multi-step Form Navigation ===
function nextStep(step) {
    if (!validateStep(step)) {
        return;
    }
    
    const currentStepEl = document.querySelector(`.form-step[data-step="${step}"]`);
    const nextStepEl = document.querySelector(`.form-step[data-step="${step + 1}"]`);
    const progressSteps = document.querySelectorAll('.progress-step');
    
    if (currentStepEl && nextStepEl) {
        currentStepEl.classList.remove('active');
        nextStepEl.classList.add('active');
        
        if (progressSteps[step]) {
            progressSteps[step].classList.add('active');
        }
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function prevStep(step) {
    const currentStepEl = document.querySelector(`.form-step[data-step="${step}"]`);
    const prevStepEl = document.querySelector(`.form-step[data-step="${step - 1}"]`);
    const progressSteps = document.querySelectorAll('.progress-step');
    
    if (currentStepEl && prevStepEl) {
        currentStepEl.classList.remove('active');
        prevStepEl.classList.add('active');
        
        if (progressSteps[step - 1]) {
            progressSteps[step - 2].classList.remove('active');
        }
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// === Form Validation ===
function validateStep(step) {
    const stepEl = document.querySelector(`.form-step[data-step="${step}"]`);
    if (!stepEl) return true;
    
    const inputs = stepEl.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    // Validate checkboxes
    const checkboxGroups = stepEl.querySelectorAll('[name*="supportType"], [name*="daysAvailable"], [name*="timeSlots"], [name*="areasOfInterest"]');
    if (checkboxGroups.length > 0) {
        const groupNames = [...new Set([...checkboxGroups].map(cb => cb.name))];
        groupNames.forEach(name => {
            const checked = stepEl.querySelectorAll(`[name="${name}"]:checked`);
            if (checked.length === 0) {
                const errorEl = stepEl.querySelector(`[name="${name}"]`).closest('.form-group').querySelector('.error-message');
                if (errorEl) {
                    errorEl.textContent = 'Please select at least one option';
                    isValid = false;
                }
            }
        });
    }
    
    // Validate radio buttons
    const radioGroups = stepEl.querySelectorAll('input[type="radio"][required]');
    if (radioGroups.length > 0) {
        const groupNames = [...new Set([...radioGroups].map(radio => radio.name))];
        groupNames.forEach(name => {
            const checked = stepEl.querySelector(`[name="${name}"]:checked`);
            if (!checked) {
                const errorEl = stepEl.querySelector(`[name="${name}"]`).closest('.form-group').querySelector('.error-message');
                if (errorEl) {
                    errorEl.textContent = 'Please select an option';
                    isValid = false;
                }
            }
        });
    }
    
    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    const type = field.type;
    const name = field.name;
    const errorEl = field.closest('.form-group')?.querySelector('.error-message');
    
    // Clear previous error
    if (errorEl) {
        errorEl.textContent = '';
        errorEl.setAttribute('role', 'alert');
    }
    field.classList.remove('error');
    field.removeAttribute('aria-invalid');
    
    // Required validation
    if (field.required && value === '') {
        showFieldError(field, 'This field is required');
        return false;
    }
    
    // Type-specific validation
    if (value !== '') {
        switch (type) {
            case 'email':
                if (!validateEmail(value)) {
                    showFieldError(field, 'Please enter a valid email address (e.g., name@example.com)');
                    return false;
                }
                break;
            
            case 'tel':
                if (!validatePhone(value)) {
                    showFieldError(field, 'Please enter a valid 10-digit Indian mobile number starting with 6-9');
                    return false;
                }
                break;
            
            case 'number':
                const min = field.getAttribute('min');
                const max = field.getAttribute('max');
                const numValue = parseFloat(value);
                
                if (isNaN(numValue)) {
                    showFieldError(field, 'Please enter a valid number');
                    return false;
                }
                if (min && numValue < parseFloat(min)) {
                    showFieldError(field, `Value must be at least ${min}`);
                    return false;
                }
                if (max && numValue > parseFloat(max)) {
                    showFieldError(field, `Value must not exceed ${max}`);
                    return false;
                }
                break;
        }
        
        // Name-specific validation
        if (name === 'fullName' || name === 'emergencyName') {
            if (value.length < 2) {
                showFieldError(field, 'Name must be at least 2 characters');
                return false;
            }
            if (!/^[a-zA-Z\s.'-]+$/.test(value)) {
                showFieldError(field, 'Name should only contain letters, spaces, and basic punctuation');
                return false;
            }
        }
        
        // Address validation
        if (name === 'address' && value.length < 10) {
            showFieldError(field, 'Please provide a complete address (at least 10 characters)');
            return false;
        }
        
        // Textarea max length validation
        if (field.tagName === 'TEXTAREA') {
            const maxLength = field.getAttribute('maxlength') || 2000;
            if (value.length > maxLength) {
                showFieldError(field, `Text must not exceed ${maxLength} characters`);
                return false;
            }
        }
    }
    
    // Select validation
    if (field.tagName === 'SELECT' && field.required && value === '') {
        showFieldError(field, 'Please select an option');
        return false;
    }
    
    return true;
}

function showFieldError(field, message) {
    const errorEl = field.closest('.form-group')?.querySelector('.error-message');
    if (errorEl) {
        errorEl.textContent = message;
        errorEl.setAttribute('role', 'alert');
    }
    field.classList.add('error');
    field.setAttribute('aria-invalid', 'true');
    
    // Announce error for screen readers
    const liveRegion = document.getElementById('formLiveRegion');
    if (liveRegion) {
        liveRegion.textContent = `Error: ${message}`;
    }
}

function validateEmail(email) {
    // More comprehensive email validation
    const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return re.test(email);
}

function validatePhone(phone) {
    // Indian mobile number validation (10 digits starting with 6-9)
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    const re = /^[6-9][0-9]{9}$/;
    return re.test(cleanPhone);
}

// === Real-time Validation ===
document.addEventListener('blur', function(e) {
    if (e.target.matches('input, select, textarea')) {
        validateField(e.target);
    }
}, true);

// === Toggle License Field ===
function toggleLicenseField(show) {
    const licenseField = document.getElementById('licenseField');
    if (licenseField) {
        licenseField.style.display = show ? 'block' : 'none';
    }
}

// === Auto-save Form Data ===
function autoSaveFormData(formType) {
    const form = document.getElementById(`${formType}Form`);
    if (!form) return;
    
    const formData = new FormData(form);
    const data = {};
    
    for (let [key, value] of formData.entries()) {
        if (data[key]) {
            if (Array.isArray(data[key])) {
                data[key].push(value);
            } else {
                data[key] = [data[key], value];
            }
        } else {
            data[key] = value;
        }
    }
    
    try {
        localStorage.setItem(`${formType}FormData`, JSON.stringify(data));
        window.jaruratCare.showAutoSave();
    } catch (error) {
        console.error('Error auto-saving form:', error);
    }
}

function loadFormData(formType) {
    try {
        const savedData = localStorage.getItem(`${formType}FormData`);
        if (savedData) {
            const data = JSON.parse(savedData);
            const form = document.getElementById(`${formType}Form`);
            
            Object.keys(data).forEach(key => {
                const field = form.querySelector(`[name="${key}"]`);
                if (field) {
                    if (field.type === 'checkbox' || field.type === 'radio') {
                        const values = Array.isArray(data[key]) ? data[key] : [data[key]];
                        values.forEach(value => {
                            const input = form.querySelector(`[name="${key}"][value="${value}"]`);
                            if (input) input.checked = true;
                        });
                    } else {
                        field.value = data[key];
                    }
                }
            });
        }
    } catch (error) {
        console.error('Error loading form data:', error);
    }
}

// === Submit Patient Form ===
function submitPatientForm() {
    if (!validateStep(3)) {
        return;
    }
    
    const form = document.getElementById('patientForm');
    const formData = new FormData(form);
    
    const data = {
        id: window.jaruratCare.generateUniqueId('PAT'),
        timestamp: window.jaruratCare.getCurrentDateTime(),
        fullName: formData.get('fullName'),
        age: formData.get('age'),
        gender: formData.get('gender'),
        contactNumber: formData.get('contactNumber'),
        email: formData.get('email') || 'Not provided',
        address: formData.get('address'),
        medicalCondition: formData.get('medicalCondition'),
        urgencyLevel: formData.get('urgencyLevel'),
        currentMedications: formData.get('currentMedications') || 'None',
        allergies: formData.get('allergies') || 'None',
        preferredHospital: formData.get('preferredHospital') || 'Any',
        supportType: formData.getAll('supportType'),
        additionalDetails: formData.get('additionalDetails') || 'None',
        insuranceInfo: formData.get('insuranceInfo') || 'Not provided',
        status: 'Pending',
        responseTime: window.jaruratCare.calculateResponseTime(formData.get('urgencyLevel'))
    };
    
    // Save to localStorage
    if (window.jaruratCare.saveData('jaruratCare_patients', data)) {
        // Show success modal
        showSuccessModal(data.id, data.responseTime, 'patient');
        
        // Clear form and saved data
        form.reset();
        localStorage.removeItem('patientFormData');
        
        // Reset to first step
        document.querySelectorAll('.form-step').forEach((step, index) => {
            step.classList.remove('active');
            if (index === 0) step.classList.add('active');
        });
        document.querySelectorAll('.progress-step').forEach((step, index) => {
            step.classList.remove('active');
            if (index === 0) step.classList.add('active');
        });
        
        // Send auto-response
        sendAutoResponse(data, 'patient');
    } else {
        window.jaruratCare.showErrorMessage('Failed to submit form. Please try again.');
    }
}

// === Submit Volunteer Form ===
function submitVolunteerForm() {
    if (!validateStep(4)) {
        return;
    }
    
    const form = document.getElementById('volunteerForm');
    const formData = new FormData(form);
    
    const data = {
        id: window.jaruratCare.generateUniqueId('VOL'),
        timestamp: window.jaruratCare.getCurrentDateTime(),
        fullName: formData.get('fullName'),
        dob: formData.get('dob'),
        gender: formData.get('gender'),
        contactNumber: formData.get('contactNumber'),
        email: formData.get('email'),
        address: formData.get('address'),
        profession: formData.get('profession'),
        education: formData.get('education'),
        medicalBackground: formData.get('medicalBackground'),
        licenseNumber: formData.get('licenseNumber') || 'N/A',
        daysAvailable: formData.getAll('daysAvailable'),
        timeSlots: formData.getAll('timeSlots'),
        hoursPerWeek: formData.get('hoursPerWeek'),
        immediateStart: formData.get('immediateStart'),
        areasOfInterest: formData.getAll('areasOfInterest'),
        languages: formData.get('languages') || 'Not specified',
        specialSkills: formData.get('specialSkills') || 'None',
        emergencyName: formData.get('emergencyName'),
        emergencyRelationship: formData.get('emergencyRelationship'),
        emergencyContact: formData.get('emergencyContact'),
        status: 'Pending Verification'
    };
    
    if (window.jaruratCare.saveData('jaruratCare_volunteers', data)) {
        showSuccessModal(data.id, null, 'volunteer');
        form.reset();
        localStorage.removeItem('volunteerFormData');
        
        // Reset to first step
        document.querySelectorAll('.form-step').forEach((step, index) => {
            step.classList.remove('active');
            if (index === 0) step.classList.add('active');
        });
        document.querySelectorAll('.progress-step').forEach((step, index) => {
            step.classList.remove('active');
            if (index === 0) step.classList.add('active');
        });
        
        sendAutoResponse(data, 'volunteer');
    } else {
        window.jaruratCare.showErrorMessage('Failed to submit form. Please try again.');
    }
}

// === Submit Contact Form ===
function submitContactForm() {
    const form = document.getElementById('contactForm');
    
    if (!form.checkValidity()) {
        form.querySelectorAll('input[required], select[required], textarea[required]').forEach(field => {
            validateField(field);
        });
        return;
    }
    
    const formData = new FormData(form);
    
    const data = {
        id: window.jaruratCare.generateUniqueId('TKT'),
        timestamp: window.jaruratCare.getCurrentDateTime(),
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone') || 'Not provided',
        subject: formData.get('subject'),
        priority: formData.get('priority'),
        message: formData.get('message'),
        status: 'Open',
        responseTime: window.jaruratCare.calculateResponseTime(formData.get('priority'))
    };
    
    if (window.jaruratCare.saveData('jaruratCare_contacts', data)) {
        showSuccessModal(data.id, data.responseTime, 'contact');
        form.reset();
        sendAutoResponse(data, 'contact');
    } else {
        window.jaruratCare.showErrorMessage('Failed to submit message. Please try again.');
    }
}

// === Show Success Modal ===
function showSuccessModal(id, responseTime, type) {
    const modal = document.getElementById('successModal');
    
    if (type === 'patient') {
        document.getElementById('requestId').textContent = id;
        document.getElementById('responseTime').textContent = responseTime;
    } else if (type === 'volunteer') {
        document.getElementById('volunteerId').textContent = id;
    } else if (type === 'contact') {
        document.getElementById('ticketId').textContent = id;
        document.getElementById('responseTime').textContent = responseTime;
    }
    
    modal.classList.add('show');
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('successModal');
    modal.classList.remove('show');
    document.body.style.overflow = '';
}

// === Auto-Response System ===
function sendAutoResponse(data, type) {
    console.log('Auto-response sent for:', type, data.id);
    
    // In a real application, this would send an email/SMS
    const messages = {
        patient: `Dear ${data.fullName},\n\nThank you for submitting your patient support request (ID: ${data.id}).\n\nOur team will review your request and respond within ${data.responseTime}.\n\nFor urgent matters, please call: +91 9876543210\n\nBest regards,\nJarurat Care Team`,
        
        volunteer: `Dear ${data.fullName},\n\nThank you for registering as a volunteer (ID: ${data.id})!\n\nWe're excited to have you join our team. Your registration is currently under review.\n\nNext steps:\n1. Background verification (3-5 business days)\n2. Onboarding email with training materials\n3. Orientation scheduling\n\nWe'll contact you soon at ${data.email}.\n\nBest regards,\nJarurat Care Volunteer Team`,
        
        contact: `Dear ${data.name},\n\nThank you for contacting us (Ticket ID: ${data.id}).\n\nWe've received your message regarding: ${data.subject}\n\nOur team will respond within ${data.responseTime}.\n\nBest regards,\nJarurat Care Support Team`
    };
    
    // Store auto-response
    const autoResponse = {
        type: type,
        recipientId: data.id,
        recipientEmail: data.email || data.contactNumber,
        message: messages[type],
        sentAt: window.jaruratCare.getCurrentDateTime()
    };
    
    const responses = JSON.parse(localStorage.getItem('jaruratCare_autoResponses') || '[]');
    responses.push(autoResponse);
    localStorage.setItem('jaruratCare_autoResponses', JSON.stringify(responses));
}

// === AI-Powered Form Assistance ===
async function getAISuggestion(context, fieldName) {
    if (!window.geminiAI) return null;

    const prompts = {
        medicalCondition: `Based on the symptoms: "${context}", suggest a brief, clear medical condition description (1-2 sentences).`,
        additionalDetails: `The patient has: "${context}". Suggest what additional information would be helpful for healthcare providers (2-3 bullet points).`,
        motivation: `Help write a brief, sincere volunteer motivation statement (2-3 sentences) for someone interested in: "${context}".`
    };

    if (!prompts[fieldName]) return null;

    try {
        const result = await window.geminiAI.generateContent(prompts[fieldName], '', { maxTokens: 150, temperature: 0.7 });
        return result.success ? result.response : null;
    } catch (error) {
        console.error('AI suggestion error:', error);
        return null;
    }
}

// Add AI suggestion button handler
function setupAISuggestions() {
    const aiButtons = document.querySelectorAll('.ai-suggest-btn');
    aiButtons.forEach(btn => {
        btn.addEventListener('click', async function() {
            const targetField = this.dataset.target;
            const contextField = this.dataset.context;
            const field = document.getElementById(targetField);
            const contextElement = document.getElementById(contextField) || document.querySelector(`[name="${contextField}"]`);
            
            if (!field || !contextElement) return;
            
            const context = contextElement.value;
            if (!context || context.length < 10) {
                showNotification('Please enter more details first for AI suggestions.', 'warning');
                return;
            }
            
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
            this.disabled = true;
            
            const suggestion = await getAISuggestion(context, targetField);
            
            if (suggestion) {
                field.value = suggestion;
                field.classList.add('ai-filled');
                showNotification('AI suggestion added! You can edit if needed.', 'success');
            } else {
                showNotification('Could not generate suggestion. Please try again.', 'error');
            }
            
            this.innerHTML = '<i class="fas fa-magic"></i> AI Suggest';
            this.disabled = false;
        });
    });
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `form-notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 10);
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Initialize AI suggestions on page load
document.addEventListener('DOMContentLoaded', function() {
    setupAISuggestions();
});

// === Export Functions ===
window.formFunctions = {
    nextStep,
    prevStep,
    validateStep,
    toggleLicenseField,
    closeModal,
    getAISuggestion,
    showNotification
};
