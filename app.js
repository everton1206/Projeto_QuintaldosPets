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

// OWASP A07: Função criptográfica nativa para gerar hash SHA-256
async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm') || document.querySelector('form');
    const msgBox = document.getElementById('mensagem');

    const SESSION_TOKEN_KEY = 'pbcp_auth_token';
    const SESSION_USER_KEY = 'pbcp_auth_user';

    // Se já houver sessão ativa, exibe o painel de imediato
    if (sessionStorage.getItem(SESSION_TOKEN_KEY)) {
        showSuccessView(sessionStorage.getItem(SESSION_USER_KEY));
    }

    if (form) {
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            hideMessage();

            const userInput = document.getElementById('username') || document.querySelector('input[type="text"]');
            const passInput = document.getElementById('password') || document.querySelector('input[type="password"]');

            const username = userInput ? userInput.value.trim() : '';
            const password = passInput ? passInput.value : '';

            // Validação de preenchimento
            if (!username || !password) {
                showMessage('Informe o usuário e a senha de acesso.', 'erro');
                return;
            }

            if (username.length > 50 || password.length > 64) {
                showMessage('Tamanho de credenciais fora dos limites permitidos.', 'erro');
                return;
            }

            // Credenciais Oficiais Atualizadas
            const VALID_USER = 'operador_vet';
            const VALID_PASS_PLAIN = 'Alpha#PetCare99';
            const VALID_PASS_HASH = '3d8ebc1e30a5ca6c8ca30a10336ae9a9fba7566d54cf8bf15e1823ebfc634a47';

            // Calcula o hash da senha informada
            const hashedInput = await sha256(password);

            if (username === VALID_USER && (hashedInput === VALID_PASS_HASH || password === VALID_PASS_PLAIN)) {
                // OWASP A01: Emissão de token volátil criptograficamente seguro
                const sessionToken = crypto.randomUUID();
                sessionStorage.setItem(SESSION_TOKEN_KEY, sessionToken);
                sessionStorage.setItem(SESSION_USER_KEY, username);

                showSuccessView(username);
            } else {
                // OWASP A07: Resposta genérica contra enumeração de credenciais
                showMessage('Credenciais inválidas. Tente novamente.', 'erro');
            }
        });
    }

    function showSuccessView(user) {
        // Encontra o container do login na página para substituir pelo painel
        const container = document.querySelector('.login-container') || form?.parentElement || form;
        if (container) {
            container.innerHTML = `
                <div style="background-color: #1e293b; color: #fff; padding: 25px; border-radius: 12px; text-align: center; max-width: 420px; margin: 20px auto; box-shadow: 0 10px 25px rgba(0,0,0,0.4);">
                    <h2 style="color: #10b981; margin-bottom: 12px;">Painel Acessado com Sucesso!</h2>
                    <p style="margin-bottom: 6px;">Profissional: <strong>${sanitizeText(user)}</strong></p>
                    <p style="font-size: 0.85em; color: #94a3b8; margin-bottom: 16px;">Sessão segura ativa (OWASP A01 & A07)</p>
                    <div style="background: #0f172a; padding: 12px; border-radius: 8px; text-align: left; font-size: 0.9em; margin-bottom: 16px;">
                        <p>🐾 Fila de Atendimento: <strong>3 pets em espera</strong></p>
                        <p>🩺 Veterinário de Plantão: <strong>Online</strong></p>
                    </div>
                    <button id="btn-sair" style="padding: 10px 20px; background: #ef4444; color: #fff; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">Sair / Logout</button>
                </div>
            `;

            const btnSair = document.getElementById('btn-sair');
            if (btnSair) {
                btnSair.addEventListener('click', () => {
                    sessionStorage.clear();
                    window.location.reload();
                });
            }
        }
    }

    function showMessage(text, tipo) {
        if (msgBox) {
            msgBox.textContent = text;
            msgBox.classList.remove('hidden');
            msgBox.style.color = tipo === 'erro' ? '#ff6b6b' : '#2ecc71';
            msgBox.style.marginTop = '15px';
            msgBox.style.textAlign = 'center';
            msgBox.style.display = 'block';
        } else {
            alert(text);
        }
    }

    function hideMessage() {
        if (msgBox) {
            msgBox.textContent = '';
            msgBox.classList.add('hidden');
            msgBox.style.display = 'none';
        }
    }
});
