/**
 * Script de vérification de sécurité côté client
 * Vérifie que toutes les protections de sécurité sont bien en place
 */

class SecurityChecker {
    constructor() {
        this.checks = [];
        this.init();
    }

    init() {
        console.log('🔍 Début de la vérification de sécurité...');
        
        // Lancer toutes les vérifications
        this.checkCSRFProtection();
        this.checkSecurityHeaders();
        this.checkXSSProtection();
        this.checkSensitiveDataExposure();
        this.checkHTTPS();
        this.checkFormSecurity();
        
        // Afficher le rapport
        this.displayReport();
    }

    /**
     * Vérification de la protection CSRF
     */
    checkCSRFProtection() {
        const result = {
            name: 'Protection CSRF',
            status: 'unknown',
            message: '',
            critical: true
        };

        if (typeof window.CSRFProtection !== 'undefined') {
            try {
                const token = window.CSRFProtection.getToken();
                if (token && token.length > 20) {
                    result.status = 'pass';
                    result.message = '✅ Protection CSRF active avec token valide';
                } else {
                    result.status = 'fail';
                    result.message = '❌ Token CSRF invalide ou trop court';
                }
            } catch (error) {
                result.status = 'fail';
                result.message = '❌ Erreur dans la protection CSRF: ' + error.message;
            }
        } else {
            result.status = 'fail';
            result.message = '❌ Protection CSRF non chargée';
        }

        this.checks.push(result);
    }

    /**
     * Vérification des headers de sécurité
     */
    checkSecurityHeaders() {
        const result = {
            name: 'Headers de sécurité',
            status: 'unknown',
            message: '',
            critical: true
        };

        const requiredHeaders = [
            'Content-Security-Policy',
            'X-Frame-Options',
            'X-XSS-Protection',
            'X-Content-Type-Options'
        ];

        const missingHeaders = [];
        const presentHeaders = [];

        requiredHeaders.forEach(header => {
            const metaTag = document.querySelector(`meta[http-equiv="${header}"]`);
            if (metaTag) {
                presentHeaders.push(header);
            } else {
                missingHeaders.push(header);
            }
        });

        if (missingHeaders.length === 0) {
            result.status = 'pass';
            result.message = `✅ Tous les headers de sécurité sont présents (${presentHeaders.length})`;
        } else if (missingHeaders.length < requiredHeaders.length / 2) {
            result.status = 'warning';
            result.message = `⚠️ Headers manquants: ${missingHeaders.join(', ')}`;
        } else {
            result.status = 'fail';
            result.message = `❌ Plusieurs headers de sécurité manquants: ${missingHeaders.join(', ')}`;
        }

        this.checks.push(result);
    }

    /**
     * Vérification de la protection XSS
     */
    checkXSSProtection() {
        const result = {
            name: 'Protection XSS',
            status: 'unknown',
            message: '',
            critical: true
        };

        // Vérifier qu'il n'y a pas d'innerHTML dangereux dans les scripts
        const scripts = document.querySelectorAll('script');
        let dangerousPatterns = 0;
        
        scripts.forEach(script => {
            if (script.textContent.includes('.innerHTML =') && 
                !script.textContent.includes('// Sécurisation XSS')) {
                dangerousPatterns++;
            }
        });

        // Vérifier la CSP
        const cspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
        const hasCSP = !!cspMeta;

        if (dangerousPatterns === 0 && hasCSP) {
            result.status = 'pass';
            result.message = '✅ Protection XSS effective (CSP + code sécurisé)';
        } else if (dangerousPatterns > 0) {
            result.status = 'fail';
            result.message = `❌ ${dangerousPatterns} pattern(s) dangereux détecté(s) dans le JavaScript`;
        } else {
            result.status = 'warning';
            result.message = '⚠️ CSP manquante mais pas de pattern dangereux détecté';
        }

        this.checks.push(result);
    }

    /**
     * Vérification de l'exposition de données sensibles
     */
    checkSensitiveDataExposure() {
        const result = {
            name: 'Exposition de données',
            status: 'unknown',
            message: '',
            critical: true
        };

        const sensitivePatterns = [
            /api[_-]?key/i,
            /secret[_-]?key/i,
            /private[_-]?key/i,
            /password\s*[:=]/i,
            /token\s*[:=]\s*["'][^"']{20,}/i,
            /firebase.*config/i
        ];

        let exposedSecrets = 0;
        const scripts = document.querySelectorAll('script');
        
        scripts.forEach(script => {
            const content = script.textContent || script.innerHTML;
            sensitivePatterns.forEach(pattern => {
                if (pattern.test(content)) {
                    exposedSecrets++;
                }
            });
        });

        if (exposedSecrets === 0) {
            result.status = 'pass';
            result.message = '✅ Aucune donnée sensible exposée détectée';
        } else {
            result.status = 'fail';
            result.message = `❌ ${exposedSecrets} donnée(s) sensible(s) potentiellement exposée(s)`;
        }

        this.checks.push(result);
    }

    /**
     * Vérification HTTPS
     */
    checkHTTPS() {
        const result = {
            name: 'Connexion HTTPS',
            status: 'unknown',
            message: '',
            critical: false
        };

        if (location.protocol === 'https:') {
            result.status = 'pass';
            result.message = '✅ Connexion sécurisée HTTPS';
        } else if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
            result.status = 'warning';
            result.message = '⚠️ Développement local (HTTP acceptable)';
        } else {
            result.status = 'fail';
            result.message = '❌ Connexion non sécurisée (HTTP)';
        }

        this.checks.push(result);
    }

    /**
     * Vérification de la sécurité des formulaires
     */
    checkFormSecurity() {
        const result = {
            name: 'Sécurité des formulaires',
            status: 'unknown',
            message: '',
            critical: true
        };

        const forms = document.querySelectorAll('form');
        let protectedForms = 0;
        let totalForms = forms.length;

        forms.forEach(form => {
            const csrfField = form.querySelector('input[name="csrf_token"]');
            if (csrfField) {
                protectedForms++;
            }
        });

        if (totalForms === 0) {
            result.status = 'info';
            result.message = 'ℹ️ Aucun formulaire détecté sur cette page';
        } else if (protectedForms === totalForms) {
            result.status = 'pass';
            result.message = `✅ Tous les formulaires protégés (${protectedForms}/${totalForms})`;
        } else {
            result.status = 'warning';
            result.message = `⚠️ Formulaires protégés: ${protectedForms}/${totalForms}`;
        }

        this.checks.push(result);
    }

    /**
     * Affichage du rapport de sécurité
     */
    displayReport() {
        const criticalFailures = this.checks.filter(check => check.status === 'fail' && check.critical).length;
        const warnings = this.checks.filter(check => check.status === 'warning').length;
        const passed = this.checks.filter(check => check.status === 'pass').length;

        // Calculer le score de sécurité
        const totalCritical = this.checks.filter(check => check.critical).length;
        const criticalPassed = this.checks.filter(check => check.status === 'pass' && check.critical).length;
        const securityScore = totalCritical > 0 ? Math.round((criticalPassed / totalCritical) * 100) : 0;

        console.log('\n🛡️ RAPPORT DE SÉCURITÉ');
        console.log('═'.repeat(50));
        console.log(`📊 Score de sécurité: ${securityScore}%`);
        console.log(`✅ Tests réussis: ${passed}`);
        console.log(`⚠️ Avertissements: ${warnings}`);
        console.log(`❌ Échecs critiques: ${criticalFailures}`);
        console.log('');

        // Détails des vérifications
        this.checks.forEach(check => {
            console.log(`${check.message}`);
        });

        console.log('═'.repeat(50));

        // Recommandations
        if (criticalFailures > 0) {
            console.log('🚨 ACTIONS REQUISES:');
            this.checks.filter(check => check.status === 'fail' && check.critical)
                      .forEach(check => console.log(`   • ${check.name}: correction nécessaire`));
        }

        if (warnings > 0) {
            console.log('⚠️ AMÉLIORATIONS SUGGÉRÉES:');
            this.checks.filter(check => check.status === 'warning')
                      .forEach(check => console.log(`   • ${check.name}: amélioration recommandée`));
        }

        // Stocker le résultat pour les tests automatisés
        window.securityReport = {
            score: securityScore,
            passed: passed,
            warnings: warnings,
            criticalFailures: criticalFailures,
            details: this.checks
        };

        return {
            score: securityScore,
            status: criticalFailures === 0 ? 'secure' : 'vulnerable'
        };
    }

    /**
     * Vérification périodique (pour les applications SPA)
     */
    startPeriodicCheck(intervalMinutes = 5) {
        setInterval(() => {
            console.log('🔄 Vérification périodique de sécurité...');
            this.checks = [];
            this.init();
        }, intervalMinutes * 60 * 1000);
    }
}

// Auto-initialisation après chargement du DOM
document.addEventListener('DOMContentLoaded', function() {
    // Attendre un peu que tous les scripts de sécurité se chargent
    setTimeout(() => {
        window.securityChecker = new SecurityChecker();
        
        // Démarrer les vérifications périodiques en développement
        if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
            window.securityChecker.startPeriodicCheck(5);
        }
    }, 1000);
});

console.log('🔒 Security Checker loaded');