/**
 * Exemple d'utilisation de la protection CSRF
 * Ce fichier montre comment implémenter correctement la protection CSRF
 */

// Attendre que le DOM soit chargé et que la protection CSRF soit initialisée
document.addEventListener('DOMContentLoaded', function() {
    
    // Exemple 1: Validation manuelle d'un formulaire
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            // La protection CSRF est automatique, mais on peut ajouter des validations supplémentaires
            console.log('🛡️ Formulaire de connexion protégé par CSRF');
            
            // Vérifier que le token CSRF est présent
            const csrfToken = loginForm.querySelector('input[name="csrf_token"]');
            if (!csrfToken || !csrfToken.value) {
                console.error('Token CSRF manquant!');
                event.preventDefault();
                return false;
            }
        });
    }
    
    // Exemple 2: Requête AJAX avec protection CSRF automatique
    function sendSecureAjaxRequest(url, data) {
        return fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Le token CSRF sera ajouté automatiquement par csrf-protection.js
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .catch(error => {
            console.error('Erreur dans la requête sécurisée:', error);
            throw error;
        });
    }
    
    // Exemple 3: Récupération manuelle du token CSRF (si nécessaire)
    function getCSRFToken() {
        if (window.CSRFProtection) {
            return window.CSRFProtection.getToken();
        }
        console.error('Protection CSRF non initialisée');
        return null;
    }
    
    // Exemple 4: Validation côté client avant soumission
    function validateFormWithCSRF(formElement) {
        if (!window.CSRFProtection) {
            console.error('Protection CSRF non disponible');
            return false;
        }
        
        const csrfField = formElement.querySelector('input[name="csrf_token"]');
        if (!csrfField) {
            console.error('Champ CSRF manquant dans le formulaire');
            return false;
        }
        
        const isValid = window.CSRFProtection.validateToken(csrfField.value);
        if (!isValid) {
            console.error('Token CSRF invalide ou expiré');
        }
        
        return isValid;
    }
    
    // Exemple 5: Gestion des erreurs CSRF personnalisée
    function handleCSRFError(error) {
        console.error('Erreur CSRF détectée:', error);
        
        // Afficher un message à l'utilisateur
        const errorMessage = document.createElement('div');
        errorMessage.className = 'csrf-error-message';
        errorMessage.innerHTML = `
            <div class="alert alert-danger">
                <strong>⚠️ Erreur de sécurité :</strong> 
                Votre session a expiré ou une erreur de sécurité s'est produite. 
                <button onclick="location.reload()">Rafraîchir la page</button>
            </div>
        `;
        
        document.body.appendChild(errorMessage);
        
        // Supprimer le message après quelques secondes
        setTimeout(() => {
            if (errorMessage.parentNode) {
                errorMessage.remove();
            }
        }, 5000);
    }
    
    // Exemple 6: Surveillance des tokens CSRF expirés
    function monitorCSRFToken() {
        setInterval(() => {
            if (window.CSRFProtection) {
                const token = window.CSRFProtection.getToken();
                if (!token) {
                    console.warn('Token CSRF expiré, rafraîchissement automatique...');
                    window.CSRFProtection.refreshToken();
                }
            }
        }, 60000); // Vérifier toutes les minutes
    }
    
    // Démarrer la surveillance
    monitorCSRFToken();
    
    // Exposer les fonctions utilitaires globalement pour les tests
    window.CSRFUtils = {
        getToken: getCSRFToken,
        validateForm: validateFormWithCSRF,
        sendSecureRequest: sendSecureAjaxRequest,
        handleError: handleCSRFError
    };
    
    console.log('🔒 CSRF Examples loaded. Use window.CSRFUtils for manual operations.');
});