// ===================================
// Main JavaScript - Jarurat Care
// ===================================

// === Mobile Navigation Toggle ===
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (navMenu && navToggle && 
            !navMenu.contains(event.target) && 
            !navToggle.contains(event.target) && 
            navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
        }
    });
    
    // Initialize counter animations
    initCounters();
    
    // Initialize storage
    initializeStorage();
});

// === Counter Animation ===
function initCounters() {
    const counters = document.querySelectorAll('.stat-number[data-count]');
    
    const animateCounter = (counter) => {
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 2000; // 2 seconds
        const step = target / (duration / 16); // 60fps
        let current = 0;
        
        // Start from 0 for animation
        counter.textContent = '0';
        
        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                counter.textContent = target + '+';
                clearInterval(timer);
            } else {
                counter.textContent = Math.floor(current);
            }
        }, 16);
    };
    
    // Intersection Observer for lazy animation
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => observer.observe(counter));
}

// === Local Storage Management ===
function initializeStorage() {
    if (!localStorage.getItem('jaruratCare_initialized')) {
        localStorage.setItem('jaruratCare_initialized', 'true');
        localStorage.setItem('jaruratCare_patients', JSON.stringify([]));
        localStorage.setItem('jaruratCare_volunteers', JSON.stringify([]));
        localStorage.setItem('jaruratCare_contacts', JSON.stringify([]));
    }
}

// === Generate Unique ID ===
function generateUniqueId(prefix) {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    return `${prefix}-${timestamp}-${random}`;
}

// === Get Current Date Time ===
function getCurrentDateTime() {
    const now = new Date();
    return now.toISOString();
}

// === Format Date ===
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return date.toLocaleDateString('en-US', options);
}

// === Save Data to LocalStorage ===
function saveData(key, data) {
    try {
        const existingData = JSON.parse(localStorage.getItem(key)) || [];
        existingData.push(data);
        localStorage.setItem(key, JSON.stringify(existingData));
        return true;
    } catch (error) {
        console.error('Error saving data:', error);
        return false;
    }
}

// === Get Data from LocalStorage ===
function getData(key) {
    try {
        return JSON.parse(localStorage.getItem(key)) || [];
    } catch (error) {
        console.error('Error getting data:', error);
        return [];
    }
}

// === Calculate Response Time ===
function calculateResponseTime(urgency) {
    const responseTimes = {
        'critical': '1-2 hours',
        'high': '4-6 hours',
        'medium': '12-24 hours',
        'low': '24-48 hours',
        'urgent': '2-4 hours',
        'normal': '24-48 hours'
    };
    return responseTimes[urgency] || '24-48 hours';
}

// === Show Success Message ===
function showSuccessMessage(message) {
    // Create toast notification
    const toast = document.createElement('div');
    toast.className = 'toast-notification success';
    toast.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;
    document.body.appendChild(toast);
    
    // Add styles if not already present
    if (!document.getElementById('toast-styles')) {
        const style = document.createElement('style');
        style.id = 'toast-styles';
        style.textContent = `
            .toast-notification {
                position: fixed;
                top: 100px;
                right: 30px;
                background: white;
                padding: 1rem 1.5rem;
                border-radius: 8px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.2);
                display: flex;
                align-items: center;
                gap: 0.75rem;
                z-index: 10000;
                animation: slideInRight 0.3s ease;
            }
            .toast-notification.success {
                border-left: 4px solid #388E3C;
            }
            .toast-notification i {
                font-size: 1.3rem;
                color: #388E3C;
            }
            @keyframes slideInRight {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Remove after 3 seconds
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// === Show Error Message ===
function showErrorMessage(message) {
    const toast = document.createElement('div');
    toast.className = 'toast-notification error';
    toast.innerHTML = `
        <i class="fas fa-exclamation-circle"></i>
        <span>${message}</span>
    `;
    toast.style.borderLeft = '4px solid #D32F2F';
    toast.querySelector('i').style.color = '#D32F2F';
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// === Auto-save Indicator ===
function showAutoSave() {
    const indicator = document.getElementById('autoSaveIndicator');
    if (indicator) {
        indicator.classList.add('show');
        setTimeout(() => {
            indicator.classList.remove('show');
        }, 2000);
    }
}

// === Smooth Scroll ===
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

// === Scroll to Top ===
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// === Add Scroll to Top Button ===
window.addEventListener('scroll', function() {
    let scrollBtn = document.getElementById('scrollTopBtn');
    
    if (!scrollBtn) {
        scrollBtn = document.createElement('button');
        scrollBtn.id = 'scrollTopBtn';
        scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
        scrollBtn.onclick = scrollToTop;
        scrollBtn.style.cssText = `
            position: fixed;
            bottom: 30px;
            left: 30px;
            width: 50px;
            height: 50px;
            background: var(--secondary-color);
            color: white;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            display: none;
            align-items: center;
            justify-content: center;
            font-size: 1.2rem;
            z-index: 1000;
            transition: all 0.3s ease;
        `;
        document.body.appendChild(scrollBtn);
    }
    
    if (window.pageYOffset > 300) {
        scrollBtn.style.display = 'flex';
    } else {
        scrollBtn.style.display = 'none';
    }
});

// === Export Functions for Global Use ===
window.jaruratCare = {
    generateUniqueId,
    getCurrentDateTime,
    formatDate,
    saveData,
    getData,
    calculateResponseTime,
    showSuccessMessage,
    showErrorMessage,
    showAutoSave
};
