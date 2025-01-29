class Auth {
    constructor() {
        this.isLoggedIn = false;
        this.authButton = document.getElementById('authButton');
        this.authRequired = document.querySelectorAll('.auth-required');
        
        // Check initial auth state without showing notification
        this.checkAuthState(false);
        
        // Bind event listeners
        this.authButton.addEventListener('click', () => this.toggleAuth());
    }
    
    checkAuthState(showNotification = false) {
        const wasLoggedIn = this.isLoggedIn;
        this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        
        // Only show notification if state changed and notifications are enabled
        if (showNotification && wasLoggedIn !== this.isLoggedIn) {
            this.updateUI(true);
        } else {
            this.updateUI(false);
        }
    }
    
    toggleAuth() {
        this.isLoggedIn = !this.isLoggedIn;
        localStorage.setItem('isLoggedIn', this.isLoggedIn);
        this.updateUI(true); // Show notification on manual toggle
    }
    
    updateUI(showNotification = false) {
        // Update button text and style
        this.authButton.textContent = this.isLoggedIn ? 'Log Out' : 'Log In';
        this.authButton.classList.toggle('logged-in', this.isLoggedIn);
        
        // Show/hide auth-required elements
        this.authRequired.forEach(element => {
            element.classList.toggle('hidden', !this.isLoggedIn);
        });
        
        // Only show notification when requested
        if (showNotification) {
            if (this.isLoggedIn) {
                this.showNotification('Welcome back!', 'success');
            } else {
                this.showNotification('Logged out successfully', 'info');
            }
        }
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}