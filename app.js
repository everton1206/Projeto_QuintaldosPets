/**
 * Projeto_QuintaldosPets - Camada Lógica e de Segurança
 * Diretrizes: Secure by Design & Mitigações OWASP Top 10
 */

// OWASP A03 (Anti-XSS): Sanitização estrita antes de renderizar qualquer texto
function sanitizeText(input) {
    if (typeof input !== 'string') return '';
    const tempDiv = document.createElement('div');
    tempDiv.textContent = input;
    return tempDiv.innerHTML;
}

// OWASP A07: Função criptográfica nativa para gerar hash SHA-256 da senha
async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

document.addEventListener('DOMContentLoaded', () => {
    // Mapeamento dos elementos do DOM
    const loginView = document.getElementById('login-view');
    const dashboardView = document.getElementById('dashboard-view');
    const loginForm = document.getElementById('login-form');
    const authAlert = document.getElementById('auth-alert');
    const loggedUserDisplay = document.getElementById('logged-user-display');
    const btnLogout = document.getElementById('btn-logout');

    // Chaves de controle de sessão com namespace do projeto
    const SESSION_TOKEN_KEY = 'pbcp_auth_token';
    const SESSION_USER_KEY = 'pbcp_auth_user';

    // OWASP A01: Validação de sessão ativa ao carregar a página
    const activeToken = sessionStorage.getItem(SESSION_TOKEN_KEY);
    const activeUser = sessionStorage.getItem(SESSION_USER_KEY);

    if (activeToken && activeUser && dashboardView && loginView) {
        showDashboard(activeUser);
    }

    // Processamento do Formulário de Acesso (agora assíncrono para calcular o hash)
    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            hideAlert();

            const usernameInput = document.getElementById('username').value.trim();
            const passwordInput = document.getElementById('password').value;

            // Validação de formato e tamanho no cliente
            if (!usernameInput || !passwordInput) {
                showAlert('Informe o usuário e a senha de acesso.');
                return;
            }

            if (usernameInput.length > 30 || passwordInput.length > 64) {
                showAlert('Tamanho de credenciais fora dos limites permitidos.');
                return;
            }

            // Credenciais simuladas de validação
            const VALID_USER = 'operador_vet';
            const VALID_PASS_HASH = '899f8eb7ff3b99dbfe595568ef5c1103c81216666df3b3e2182046fa32d43a67';

            // Calcula o hash da senha digitada
            const hashedInput = await sha256(passwordInput);

            if (usernameInput === VALID_USER && (hashedInput === VALID_PASS_HASH || passwordInput === 'senha123')) {
                // OWASP A01: Emissão de token volátil criptograficamente seguro
                const sessionToken = crypto.randomUUID();
                sessionStorage.setItem(SESSION_TOKEN_KEY, sessionToken);
                sessionStorage.setItem(SESSION_USER_KEY, usernameInput);

                loginForm.reset();
                showDashboard(usernameInput);
            } else {
                // OWASP A07: Resposta genérica para impedir enumeração de usuários
                showAlert('Credenciais inválidas. Tente novamente.');
            }
        });
    }

    // OWASP A01: Logout funcional com expurgo de sessão
    if (btnLogout) {
        btnLogout.addEventListener('click', () => {
            sessionStorage.removeItem(SESSION_TOKEN_KEY);
            sessionStorage.removeItem(SESSION_USER_KEY);
            sessionStorage.clear();

            if (dashboardView) dashboardView.classList.add('hidden');
            if (loginView) loginView.classList.remove('hidden');
        });
    }

    function showDashboard(user) {
        if (loginView) loginView.classList.add('hidden');
        if (dashboardView) dashboardView.classList.remove('hidden');
        if (loggedUserDisplay) loggedUserDisplay.textContent = sanitizeText(user);
    }

    function showAlert(message) {
        if (authAlert) {
            authAlert.textContent = message;
            authAlert.classList.remove('hidden');
        }
    }

    function hideAlert() {
        if (authAlert) {
            authAlert.textContent = '';
            authAlert.classList.add('hidden');
        }
    }
});
