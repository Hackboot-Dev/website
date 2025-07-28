import { signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

export function setupLoginForm(auth) {
    const loginForm = document.getElementById('login-form');
    const errorMessage = document.getElementById('error-message');

    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            console.log('login.js: Form submitted.');
            console.log('login.js: Attempting login with email:', email);

            try {
                console.log('login.js: Calling signInWithEmailAndPassword...');
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                console.log('login.js: Login successful!', userCredential.user);
                window.location.href = '/account/hct/lobby.html'; // Redirection réactivée
            } catch (error) {
                console.error('login.js: Login Error caught:', error);
                let message = 'An unknown error occurred.';
                switch (error.code) {
                    case 'auth/invalid-email':
                        message = 'Invalid email address.';
                        break;
                    case 'auth/user-disabled':
                        message = 'This user account has been disabled.';
                        break;
                    case 'auth/user-not-found':
                    case 'auth/wrong-password':
                        message = 'Invalid email or password.';
                        break;
                    case 'auth/too-many-requests':
                        message = 'Too many login attempts. Please try again later.';
                        break;
                    default:
                        message = error.message;
                }
                if (errorMessage) {
                    errorMessage.textContent = message;
                    errorMessage.style.display = 'block';
                }
            }
        });
    }
}

export function setupLogoutButton(auth) {
    const logoutButton = document.getElementById('logout-button');

    if (logoutButton) {
        logoutButton.addEventListener('click', async () => {
            try {
                await signOut(auth);
                window.location.href = '/index.html';
            } catch (error) {
                console.error('Logout Error:', error);
                alert('Failed to log out: ' + error.message);
            }
        });
    }
}