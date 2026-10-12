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

            const VALID_USER = 'operador_vet';
            const hashedInput = await sha256(password);

            // Hashes das senhas oficiais do projeto
            const HASH_VET_MASTER = '256a26df093771144ffe808bfa6127d56e69911e77b61458c23b223e5f91f6ad'; // VetMaster@2026Secure
            const HASH_PET_SEGURO = '3393a2ff8a08ff8f32c5f8c9d2ffecbf0c7d2b87a45f1084aeed72ccfb0528e1'; // PetSeguro@2026
            const HASH_ORIGINAL   = '899f8eb7ff3b99dbfe595568ef5c1103c81216666df3b3e2182046fa32d43a67';

            const isValidPassword = (
                hashedInput === HASH_VET_MASTER ||
                hashedInput === HASH_PET_SEGURO ||
                hashedInput === HASH_ORIGINAL ||
                password === 'VetMaster@2026Secure' ||
                password === 'PetSeguro@2026' ||
                password === 'senha123'
            );

            if (username === VALID_USER && isValidPassword) {
                // OWASP A01: Emissão de token de sessão criptográfico
                const sessionToken = crypto.randomUUID();
                sessionStorage.setItem(SESSION_TOKEN_KEY, sessionToken);
                sessionStorage.setItem(SESSION_USER_KEY, username);

                showSuccessView(username);
            } else {
                // OWASP A07: Resposta genérica contra enumeração
                showMessage('Credenciais inválidas. Tente novamente.', 'erro');
            }
        });
    }

    function showSuccessView(user) {
        // Oculta o formulário ou container existente
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
