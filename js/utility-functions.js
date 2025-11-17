// utility-functions.js - Essential utility functions for the JDM Classic Showroom

// Get current logged in user
function getCurrentUser() {
    try {
        const userData = localStorage.getItem('jdmCurrentUser');
        if (userData && userData !== 'undefined') {
            return JSON.parse(userData);
        }
    } catch (e) {
        console.error('Error parsing current user:', e);
    }
    return null;
}

// Show custom alert/notification
function showCustomAlert(message, type = 'info') {
    // Remove any existing alerts
    const existingAlert = document.querySelector('.custom-alert');
    if (existingAlert) {
        existingAlert.remove();
    }
    
    const alert = document.createElement('div');
    alert.className = `custom-alert custom-alert-${type}`;
    alert.innerHTML = `
        <div class="alert-content">
            <span class="alert-message">${message}</span>
            <button class="alert-close">&times;</button>
        </div>
    `;
    
    // Add styles if not already added
    if (!document.querySelector('#alert-styles')) {
        const styles = document.createElement('style');
        styles.id = 'alert-styles';
        styles.textContent = `
            .custom-alert {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                background: var(--bg-card);
                border: 1px solid rgba(125, 95, 255, 0.3);
                border-radius: 8px;
                padding: 1rem;
                box-shadow: 0 10px 30px rgba(0,0,0,0.5);
                max-width: 400px;
                animation: slideInRight 0.3s ease;
            }
            .custom-alert-success {
                border-color: rgba(39, 174, 96, 0.5);
                background: rgba(39, 174, 96, 0.1);
            }
            .custom-alert-error {
                border-color: rgba(255, 59, 59, 0.5);
                background: rgba(255, 59, 59, 0.1);
            }
            .alert-content {
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 1rem;
            }
            .alert-close {
                background: none;
                border: none;
                color: var(--text-dim);
                font-size: 1.2rem;
                cursor: pointer;
                padding: 0;
                width: 24px;
                height: 24px;
            }
            .alert-close:hover {
                color: var(--text-light);
            }
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(styles);
    }
    
    document.body.appendChild(alert);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (alert.parentNode) {
            alert.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => alert.remove(), 300);
        }
    }, 5000);
    
    // Close button functionality
    alert.querySelector('.alert-close').addEventListener('click', () => {
        alert.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => alert.remove(), 300);
    });
}

// Success alert shortcut
function showSuccessAlert(message) {
    showCustomAlert(message, 'success');
}

// Error alert shortcut
function showErrorAlert(message) {
    showCustomAlert(message, 'error');
}

// Get user purchases
function getUserPurchases() {
    const currentUser = getCurrentUser();
    if (!currentUser) return [];
    
    const purchases = JSON.parse(localStorage.getItem('jdmPurchases') || '{}');
    return purchases[currentUser.email] || [];
}

// Check if user is logged in
function isUserLoggedIn() {
    return localStorage.getItem('jdmLoggedIn') === 'true' && getCurrentUser() !== null;
}

// Redirect to login if not authenticated
function requireAuth() {
    if (!isUserLoggedIn()) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

// Generate random ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Utility function to remove duplicate event listeners
function cleanupEventListeners(selector, eventType) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
        const newElement = element.cloneNode(true);
        element.parentNode.replaceChild(newElement, element);
    });
    console.log(`Cleaned up event listeners for: ${selector}`);
}