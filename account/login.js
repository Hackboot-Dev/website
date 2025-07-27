
// Helper function to set a cookie
function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

// Helper function to get a cookie
function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

// Main logic, run after the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // 1. Check if user is already logged in and redirect if they are
    const isLoggedIn = getCookie("isLoggedIn");
    if (isLoggedIn === "true") {
        window.location.href = '/account/hct/lobby.html';
        return; // Stop further execution
    }

    // 2. Handle the login form submission
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const errorMessage = document.getElementById('error-message');

            try {
                const response = await fetch('/account/users.json');
                if (!response.ok) {
                    throw new Error('Could not fetch users.json');
                }
                const data = await response.json();
                const users = data.users;
                const encodedPassword = btoa(password);
                const user = users.find(u => u.username === username && u.password === encodedPassword);

                if (user) {
                    // Successful login: Set cookies that the dashboard expects
                    setCookie('isLoggedIn', 'true', 1); // For the guard script
                    setCookie('currentUser', user.username, 1); // For the main dashboard script
                    setCookie('status', user.status, 1);

                    // Redirect to the lobby
                    window.location.href = '/account/hct/lobby.html';

                } else {
                    // Failed login
                    if (errorMessage) {
                        errorMessage.textContent = 'Invalid username or password.';
                        errorMessage.style.display = 'block';
                    }
                }
            } catch (error) {
                console.error('Login Error:', error);
                if (errorMessage) {
                    errorMessage.textContent = 'An error occurred during login. Details: ' + error.message;
                    errorMessage.style.display = 'block';
                }
            }
        });
    }

    // 3. Handle logout functionality (if a logout button exists on the page)
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            // Clear all relevant cookies
            document.cookie = "isLoggedIn=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            document.cookie = "currentUser=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"; // Also clear old cookie
            document.cookie = "status=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            
            // Redirect to homepage
            window.location.href = '/index.html';
        });
    }
});
