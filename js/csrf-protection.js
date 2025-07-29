/**
 * Système de protection CSRF
 * Génère et valide des tokens CSRF pour prévenir les attaques Cross-Site Request Forgery
 */

class CSRFProtection {
    constructor() {
        this.tokenName = 'csrf_token';
        this.tokenExpiry = 3600000; // 1 heure en millisecondes
        this.init();
    }

    /**
     * Initialise le système CSRF
     */
    init() {
        // Générer un token au chargement de la page
        this.generateToken();
        
        // Ajouter le token à tous les formulaires existants
        this.protectAllForms();
        
        // Observer les nouveaux formulaires ajoutés dynamiquement
        this.observeFormChanges();
        
        // Ajouter le token aux requêtes AJAX
        this.protectAjaxRequests();
    }

    /**
     * Génère un token CSRF cryptographiquement sécurisé
     */
    generateToken() {
        // Utiliser l'API Web Crypto pour générer un token sécurisé
        const array = new Uint8Array(32);
        crypto.getRandomValues(array);
        const token = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
        
        const tokenData = {
            token: token,
            timestamp: Date.now(),
            expires: Date.now() + this.tokenExpiry
        };
        
        // Stocker dans sessionStorage (plus sécurisé que localStorage)
        sessionStorage.setItem(this.tokenName, JSON.stringify(tokenData));
        
        // Mettre à jour tous les champs cachés existants
        this.updateHiddenFields(token);
        
        return token;
    }

    /**
     * Récupère le token CSRF actuel
     */
    getToken() {
        try {
            const tokenData = JSON.parse(sessionStorage.getItem(this.tokenName));
            
            if (!tokenData) {
                return this.generateToken();
            }
            
            // Vérifier l'expiration
            if (Date.now() > tokenData.expires) {
                console.warn('CSRF token expired, generating new one');
                return this.generateToken();
            }
            
            return tokenData.token;
        } catch (error) {
            console.error('Error retrieving CSRF token:', error);
            return this.generateToken();
        }
    }

    /**
     * Valide un token CSRF
     */
    validateToken(submittedToken) {
        try {
            const tokenData = JSON.parse(sessionStorage.getItem(this.tokenName));
            
            if (!tokenData || !submittedToken) {
                return false;
            }
            
            // Vérifier l'expiration
            if (Date.now() > tokenData.expires) {
                return false;
            }
            
            // Comparaison sécurisée (timing-safe)
            return this.secureCompare(tokenData.token, submittedToken);
        } catch (error) {
            console.error('Error validating CSRF token:', error);
            return false;
        }
    }

    /**
     * Comparaison sécurisée pour éviter les attaques de timing
     */
    secureCompare(a, b) {
        if (a.length !== b.length) {
            return false;
        }
        
        let result = 0;
        for (let i = 0; i < a.length; i++) {
            result |= a.charCodeAt(i) ^ b.charCodeAt(i);
        }
        
        return result === 0;
    }

    /**
     * Ajoute la protection CSRF à tous les formulaires existants
     */
    protectAllForms() {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => this.protectForm(form));
    }

    /**
     * Ajoute la protection CSRF à un formulaire spécifique
     */
    protectForm(form) {
        // Éviter les doublons
        if (form.querySelector(`input[name="${this.tokenName}"]`)) {
            return;
        }

        // Créer un champ caché pour le token CSRF
        const tokenField = document.createElement('input');
        tokenField.type = 'hidden';
        tokenField.name = this.tokenName;
        tokenField.value = this.getToken();
        tokenField.setAttribute('data-csrf-field', 'true');
        
        form.appendChild(tokenField);

        // Ajouter un écouteur de soumission pour validation
        form.addEventListener('submit', (event) => {
            if (!this.validateFormSubmission(form)) {
                event.preventDefault();
                this.showCSRFError();
                return false;
            }
        });
    }

    /**
     * Valide la soumission d'un formulaire
     */
    validateFormSubmission(form) {
        const tokenField = form.querySelector(`input[name="${this.tokenName}"]`);
        
        if (!tokenField) {
            console.error('CSRF token field not found in form');
            return false;
        }
        
        return this.validateToken(tokenField.value);
    }

    /**
     * Met à jour tous les champs cachés avec le nouveau token
     */
    updateHiddenFields(token) {
        const tokenFields = document.querySelectorAll(`input[name="${this.tokenName}"]`);
        tokenFields.forEach(field => {
            field.value = token;
        });
    }

    /**
     * Observe les changements dans le DOM pour protéger les nouveaux formulaires
     */
    observeFormChanges() {
        if (typeof MutationObserver !== 'undefined') {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // Nouveau formulaire ajouté
                            if (node.tagName === 'FORM') {
                                this.protectForm(node);
                            }
                            // Formulaires dans des sous-éléments
                            const forms = node.querySelectorAll && node.querySelectorAll('form');
                            if (forms) {
                                forms.forEach(form => this.protectForm(form));
                            }
                        }
                    });
                });
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
    }

    /**
     * Protège les requêtes AJAX en ajoutant automatiquement le token CSRF
     */
    protectAjaxRequests() {
        // Intercepter les requêtes fetch
        const originalFetch = window.fetch;
        const self = this;
        
        window.fetch = function(url, options = {}) {
            // Ajouter le token CSRF aux requêtes POST, PUT, PATCH, DELETE
            if (options.method && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(options.method.toUpperCase())) {
                options.headers = options.headers || {};
                options.headers['X-CSRF-Token'] = self.getToken();
            }
            
            return originalFetch.call(this, url, options);
        };

        // Intercepter XMLHttpRequest
        const originalOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
            this._method = method;
            return originalOpen.call(this, method, url, async, user, password);
        };

        const originalSend = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.send = function(data) {
            if (this._method && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(this._method.toUpperCase())) {
                this.setRequestHeader('X-CSRF-Token', self.getToken());
            }
            return originalSend.call(this, data);
        };
    }

    /**
     * Affiche une erreur CSRF à l'utilisateur
     */
    showCSRFError() {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'fixed top-4 right-4 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 opacity-0 transition-opacity duration-300';
        errorDiv.innerHTML = `
            <div class="flex items-center">
                <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                </svg>
                <span>Erreur de sécurité : Token CSRF invalide. Veuillez rafraîchir la page.</span>
                <button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-white hover:text-gray-200">
                    ×
                </button>
            </div>
        `;
        
        document.body.appendChild(errorDiv);
        
        // Animation d'apparition
        setTimeout(() => {
            errorDiv.classList.remove('opacity-0');
        }, 100);
        
        // Disparition automatique
        setTimeout(() => {
            errorDiv.classList.add('opacity-0');
            setTimeout(() => {
                if (errorDiv.parentNode) {
                    errorDiv.remove();
                }
            }, 300);
        }, 5000);
    }

    /**
     * Régénère le token (à appeler périodiquement ou après certaines actions)
     */
    refreshToken() {
        return this.generateToken();
    }

    /**
     * Nettoie les tokens expirés
     */
    cleanup() {
        try {
            const tokenData = JSON.parse(sessionStorage.getItem(this.tokenName));
            if (tokenData && Date.now() > tokenData.expires) {
                sessionStorage.removeItem(this.tokenName);
            }
        } catch (error) {
            console.error('Error during CSRF cleanup:', error);
        }
    }
}

// Instance globale
window.CSRFProtection = new CSRFProtection();

// Auto-nettoyage périodique (toutes les 10 minutes)
setInterval(() => {
    window.CSRFProtection.cleanup();
}, 600000);

// Rafraîchir le token avant expiration (toutes les 45 minutes)
setInterval(() => {
    window.CSRFProtection.refreshToken();
}, 2700000);

console.log('🛡️ CSRF Protection initialized');