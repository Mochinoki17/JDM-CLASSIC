// User Profile functionality - COMPLETELY FIXED VERSION
document.addEventListener('DOMContentLoaded', function() {
    console.log('User profile page loaded');
    
    // Check if utility functions are available
    if (typeof getCurrentUser === 'undefined') {
        console.error('Utility functions not loaded!');
        showCustomAlert('Error: Required scripts not loaded properly.');
        return;
    }
    
    const loginModal = document.getElementById('loginModal');
    const currentUser = getCurrentUser();
    const isLoggedIn = localStorage.getItem('jdmLoggedIn') === 'true';

    // Redirect to login if not authenticated
    if (!isLoggedIn || !currentUser) {
        console.log('User not logged in, redirecting to login');
        setTimeout(() => {
            if (loginModal) {
                loginModal.style.display = 'flex';
                document.body.classList.add('modal-active');
            } else {
                window.location.href = 'login.html';
            }
        }, 500);
        return;
    }

    console.log('User is logged in:', currentUser);

    // Initialize all profile functionality
    initializeProfile();
    initializeProfileNavigation();
    initializeFormHandlers();
    initializeActionButtons();
    
    console.log('User profile completely initialized');
});

function initializeProfile() {
    const currentUser = getCurrentUser();
    const userProfile = getUserProfile();
    
    console.log('Initializing profile for:', currentUser);
    console.log('User profile data:', userProfile);
    
    // Update user info display
    const userName = document.getElementById('userName');
    const userEmail = document.getElementById('userEmail');
    const profileWelcome = document.getElementById('profileWelcome');
    const userAvatar = document.getElementById('userAvatar');
    
    if (userName) userName.textContent = currentUser.fullName || 'User';
    if (userEmail) userEmail.textContent = currentUser.email || 'No email';
    if (profileWelcome) {
        const firstName = currentUser.fullName ? currentUser.fullName.split(' ')[0] : 'User';
        profileWelcome.textContent = `Welcome back, ${firstName}! Manage your account settings and preferences.`;
    }
    
    // Generate avatar from initials
    const initials = currentUser.fullName ? 
        currentUser.fullName.split(' ').map(name => name[0]).join('').toUpperCase() : 
        'U';
    if (userAvatar) userAvatar.textContent = initials;
    
    // Load profile data into forms
    loadProfileData(userProfile);
}

function getUserProfile() {
    const currentUser = getCurrentUser();
    if (!currentUser) {
        console.error('No current user found');
        return createDefaultProfile({ fullName: 'User', email: '' });
    }
    
    try {
        const profiles = JSON.parse(localStorage.getItem('jdmUserProfiles') || '{}');
        const profile = profiles[currentUser.email] || createDefaultProfile(currentUser);
        
        console.log('Retrieved user profile:', profile);
        return profile;
    } catch (e) {
        console.error('Error getting user profile:', e);
        return createDefaultProfile(currentUser);
    }
}

function createDefaultProfile(user) {
    return {
        personalInfo: {
            fullName: user.fullName || '',
            email: user.email || '',
            phone: '',
            address: ''
        },
        preferences: {
            favoriteBrands: [],
            newsletter: 'monthly',
            eventNotifications: true
        },
        notifications: {
            email: {
                purchase: true,
                shipping: true,
                promotions: false,
                events: true
            },
            push: {
                new_cars: true,
                price_drops: false,
                maintenance: false
            }
        }
    };
}

function loadProfileData(profile) {
    console.log('Loading profile data into forms:', profile);
    
    // Personal Info
    const fullNameInput = document.getElementById('profileFullName');
    const emailInput = document.getElementById('profileEmail');
    const phoneInput = document.getElementById('profilePhone');
    const addressInput = document.getElementById('profileAddress');
    
    if (fullNameInput) fullNameInput.value = profile.personalInfo.fullName || '';
    if (emailInput) emailInput.value = profile.personalInfo.email || '';
    if (phoneInput) phoneInput.value = profile.personalInfo.phone || '';
    if (addressInput) addressInput.value = profile.personalInfo.address || '';
    
    // Preferences
    const brandCheckboxes = document.querySelectorAll('input[name="brands"]');
    brandCheckboxes.forEach(checkbox => {
        checkbox.checked = profile.preferences.favoriteBrands.includes(checkbox.value);
    });
    
    const newsletterSelect = document.getElementById('newsletter');
    const eventNotifications = document.getElementById('eventNotifications');
    
    if (newsletterSelect) newsletterSelect.value = profile.preferences.newsletter || 'monthly';
    if (eventNotifications) eventNotifications.checked = profile.preferences.eventNotifications !== false;
    
    // Notifications
    const emailNotifications = document.querySelectorAll('input[name="emailNotifications"]');
    emailNotifications.forEach(checkbox => {
        checkbox.checked = profile.notifications.email[checkbox.value] !== false;
    });
    
    const pushNotifications = document.querySelectorAll('input[name="pushNotifications"]');
    pushNotifications.forEach(checkbox => {
        checkbox.checked = profile.notifications.push[checkbox.value] === true;
    });
}

function initializeProfileNavigation() {
    console.log('Initializing profile navigation');
    
    const navLinks = document.querySelectorAll('.profile-nav-link');
    const sections = document.querySelectorAll('.profile-section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            console.log('Navigation clicked:', this.getAttribute('href'));
            
            // Remove active class from all links and sections
            navLinks.forEach(nav => nav.classList.remove('active'));
            sections.forEach(section => section.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Show corresponding section
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                targetSection.classList.add('active');
                console.log('Showing section:', targetId);
            } else {
                console.error('Section not found:', targetId);
            }
        });
    });
    
    // Activate first section by default
    if (navLinks.length > 0 && sections.length > 0) {
        navLinks[0].classList.add('active');
        sections[0].classList.add('active');
    }
}

function initializeFormHandlers() {
    console.log('Initializing form handlers');
    
    // Personal Info Form
    const personalInfoForm = document.getElementById('personalInfoForm');
    if (personalInfoForm) {
        personalInfoForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Personal info form submitted');
            savePersonalInfo();
        });
    } else {
        console.error('Personal info form not found');
    }
    
    // Preferences Form
    const preferencesForm = document.getElementById('preferencesForm');
    if (preferencesForm) {
        preferencesForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Preferences form submitted');
            savePreferences();
        });
    } else {
        console.error('Preferences form not found');
    }
    
    // Security Form
    const securityForm = document.getElementById('securityForm');
    if (securityForm) {
        securityForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Security form submitted');
            updatePassword();
        });
    } else {
        console.error('Security form not found');
    }
    
    // Notifications Form
    const notificationsForm = document.getElementById('notificationsForm');
    if (notificationsForm) {
        notificationsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Notifications form submitted');
            saveNotificationSettings();
        });
    } else {
        console.error('Notifications form not found');
    }
}

function initializeActionButtons() {
    console.log('Initializing action buttons');
    
    // Export Data
    const exportBtn = document.getElementById('exportData');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportUserData);
        console.log('Export button initialized');
    } else {
        console.error('Export button not found');
    }
    
    // Logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
        console.log('Logout button initialized');
    } else {
        console.error('Logout button not found');
    }
    
    // Delete Account
    const deleteBtn = document.getElementById('deleteAccount');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', confirmAccountDeletion);
        console.log('Delete account button initialized');
    } else {
        console.error('Delete account button not found');
    }
}

function handleLogout() {
    console.log('Logging out user');
    localStorage.removeItem('jdmCurrentUser');
    localStorage.setItem('jdmLoggedIn', 'false');
    showCustomAlert('You have been logged out successfully.');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1500);
}

function savePersonalInfo() {
    console.log('Saving personal info');
    
    const currentUser = getCurrentUser();
    if (!currentUser) {
        showCustomAlert('You must be logged in to save changes.');
        return;
    }
    
    const profiles = JSON.parse(localStorage.getItem('jdmUserProfiles') || '{}');
    
    if (!profiles[currentUser.email]) {
        profiles[currentUser.email] = createDefaultProfile(currentUser);
    }
    
    const fullName = document.getElementById('profileFullName').value;
    const email = document.getElementById('profileEmail').value;
    const phone = document.getElementById('profilePhone').value;
    const address = document.getElementById('profileAddress').value;
    
    profiles[currentUser.email].personalInfo = {
        fullName: fullName,
        email: email,
        phone: phone,
        address: address
    };
    
    // Update main user data if email changed
    if (email !== currentUser.email) {
        updateUserEmail(currentUser.email, email);
    }
    
    localStorage.setItem('jdmUserProfiles', JSON.stringify(profiles));
    showCustomAlert('Personal information updated successfully!', 'success');
}

function savePreferences() {
    console.log('Saving preferences');
    
    const currentUser = getCurrentUser();
    if (!currentUser) {
        showCustomAlert('You must be logged in to save changes.');
        return;
    }
    
    const profiles = JSON.parse(localStorage.getItem('jdmUserProfiles') || '{}');
    
    if (!profiles[currentUser.email]) {
        profiles[currentUser.email] = createDefaultProfile(currentUser);
    }
    
    const selectedBrands = Array.from(document.querySelectorAll('input[name="brands"]:checked'))
        .map(checkbox => checkbox.value);
    
    const newsletter = document.getElementById('newsletter').value;
    const eventNotifications = document.getElementById('eventNotifications').checked;
    
    profiles[currentUser.email].preferences = {
        favoriteBrands: selectedBrands,
        newsletter: newsletter,
        eventNotifications: eventNotifications
    };
    
    localStorage.setItem('jdmUserProfiles', JSON.stringify(profiles));
    showCustomAlert('Preferences updated successfully!', 'success');
}

function updatePassword() {
    console.log('Updating password');
    
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmNewPassword = document.getElementById('confirmNewPassword').value;
    
    if (!currentPassword) {
        showCustomAlert('Please enter your current password.');
        return;
    }
    
    if (newPassword !== confirmNewPassword) {
        showCustomAlert('New passwords do not match!');
        return;
    }
    
    if (newPassword.length < 6) {
        showCustomAlert('New password must be at least 6 characters long.');
        return;
    }
    
    const currentUser = getCurrentUser();
    const users = JSON.parse(localStorage.getItem('jdmUsers') || '[]');
    const userIndex = users.findIndex(u => u.email === currentUser.email);
    
    if (userIndex === -1 || users[userIndex].password !== currentPassword) {
        showCustomAlert('Current password is incorrect.');
        return;
    }
    
    // Update password
    users[userIndex].password = newPassword;
    localStorage.setItem('jdmUsers', JSON.stringify(users));
    
    // Update current user in localStorage
    currentUser.password = newPassword;
    localStorage.setItem('jdmCurrentUser', JSON.stringify(currentUser));
    
    // Clear form
    document.getElementById('securityForm').reset();
    
    showCustomAlert('Password updated successfully!', 'success');
}

function saveNotificationSettings() {
    console.log('Saving notification settings');
    
    const currentUser = getCurrentUser();
    if (!currentUser) {
        showCustomAlert('You must be logged in to save changes.');
        return;
    }
    
    const profiles = JSON.parse(localStorage.getItem('jdmUserProfiles') || '{}');
    
    if (!profiles[currentUser.email]) {
        profiles[currentUser.email] = createDefaultProfile(currentUser);
    }
    
    const emailNotifications = {};
    document.querySelectorAll('input[name="emailNotifications"]').forEach(checkbox => {
        emailNotifications[checkbox.value] = checkbox.checked;
    });
    
    const pushNotifications = {};
    document.querySelectorAll('input[name="pushNotifications"]').forEach(checkbox => {
        pushNotifications[checkbox.value] = checkbox.checked;
    });
    
    profiles[currentUser.email].notifications = {
        email: emailNotifications,
        push: pushNotifications
    };
    
    localStorage.setItem('jdmUserProfiles', JSON.stringify(profiles));
    showCustomAlert('Notification settings updated successfully!', 'success');
}

function updateUserEmail(oldEmail, newEmail) {
    console.log('Updating user email from', oldEmail, 'to', newEmail);
    
    // Update users array
    const users = JSON.parse(localStorage.getItem('jdmUsers') || '[]');
    const userIndex = users.findIndex(u => u.email === oldEmail);
    
    if (userIndex !== -1) {
        users[userIndex].email = newEmail;
        localStorage.setItem('jdmUsers', JSON.stringify(users));
    }
    
    // Update current user
    const currentUser = getCurrentUser();
    currentUser.email = newEmail;
    localStorage.setItem('jdmCurrentUser', JSON.stringify(currentUser));
    
    // Update profile data key
    const profiles = JSON.parse(localStorage.getItem('jdmUserProfiles') || '{}');
    if (profiles[oldEmail]) {
        profiles[newEmail] = profiles[oldEmail];
        delete profiles[oldEmail];
        localStorage.setItem('jdmUserProfiles', JSON.stringify(profiles));
    }
    
    // Update purchases key
    const purchases = JSON.parse(localStorage.getItem('jdmPurchases') || '{}');
    if (purchases[oldEmail]) {
        purchases[newEmail] = purchases[oldEmail];
        delete purchases[oldEmail];
        localStorage.setItem('jdmPurchases', JSON.stringify(purchases));
    }
}

function exportUserData() {
    console.log('Exporting user data');
    
    const currentUser = getCurrentUser();
    if (!currentUser) {
        showCustomAlert('You must be logged in to export data.');
        return;
    }
    
    const userProfile = getUserProfile();
    const purchases = getUserPurchases();
    
    const userData = {
        userInfo: {
            ...currentUser,
            password: undefined // Remove password for security
        },
        profile: userProfile,
        purchases: purchases,
        exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(userData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `jdm-classic-data-${currentUser.email}-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    showCustomAlert('Your data has been exported successfully!', 'success');
}

function confirmAccountDeletion() {
    console.log('Confirming account deletion');
    
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.style.display = 'flex';
    overlay.style.zIndex = '3000';
    
    const modal = document.createElement('div');
    modal.className = 'modal-content';
    modal.innerHTML = `
        <div class="modal-header">
            <h2>Delete Account</h2>
        </div>
        <div style="text-align: center; padding: 1rem;">
            <p><strong>Warning: This action cannot be undone!</strong></p>
            <p>All your data including profile information, preferences, and purchase history will be permanently deleted.</p>
            <p>Please type <strong>DELETE</strong> to confirm:</p>
            <input type="text" id="deleteConfirm" placeholder="Type DELETE here" style="width: 100%; margin: 1rem 0; padding: 0.75rem; border-radius: 6px; border: 1px solid rgba(255, 59, 59, 0.4); background: rgba(255, 59, 59, 0.1); color: white;">
            <div style="display: flex; gap: 1rem; justify-content: center; margin-top: 1.5rem;">
                <button class="btn-secondary" onclick="this.closest('.modal-overlay').remove()">Cancel</button>
                <button class="btn-primary" id="confirmDeleteAccount" style="background: #ff3b3b;">Delete My Account</button>
            </div>
        </div>
    `;
    
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    document.getElementById('confirmDeleteAccount').addEventListener('click', function() {
        const confirmInput = document.getElementById('deleteConfirm');
        if (confirmInput.value === 'DELETE') {
            deleteUserAccount();
            overlay.remove();
        } else {
            showCustomAlert('Please type DELETE exactly as shown to confirm account deletion.');
        }
    });
}

function deleteUserAccount() {
    console.log('Deleting user account');
    
    const currentUser = getCurrentUser();
    if (!currentUser) {
        showCustomAlert('No user account found to delete.');
        return;
    }
    
    // Remove user from users array
    let users = JSON.parse(localStorage.getItem('jdmUsers') || '[]');
    users = users.filter(u => u.email !== currentUser.email);
    localStorage.setItem('jdmUsers', JSON.stringify(users));
    
    // Remove user profiles
    let profiles = JSON.parse(localStorage.getItem('jdmUserProfiles') || '{}');
    delete profiles[currentUser.email];
    localStorage.setItem('jdmUserProfiles', JSON.stringify(profiles));
    
    // Remove user purchases
    let purchases = JSON.parse(localStorage.getItem('jdmPurchases') || '{}');
    delete purchases[currentUser.email];
    localStorage.setItem('jdmPurchases', JSON.stringify(purchases));
    
    // Clear current session
    localStorage.removeItem('jdmCurrentUser');
    localStorage.setItem('jdmLoggedIn', 'false');
    
    showCustomAlert('Your account has been deleted successfully. Thank you for being part of JDM Classic!', 'success');
    
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 2000);
}

// Make functions globally available
window.handleLogout = handleLogout;
window.exportUserData = exportUserData;
window.confirmAccountDeletion = confirmAccountDeletion;
window.deleteUserAccount = deleteUserAccount;