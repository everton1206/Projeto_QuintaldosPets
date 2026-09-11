document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const mensagemDiv = document.getElementById('mensagem');

    // ALERTA FORENSE/SEGURANÇA: 
    // Nunca faça isso em um sistema real. Credenciais no front-end são expostas a qualquer visitante.
    const mockDatabase = {
        usuarioAdmin: "admin",
        senhaAdmin: "PetSeguro2026!"
    };

    loginForm.addEventListener('submit', (evento) => {
        // Previne que a página recarregue ao enviar o formulário
        evento.preventDefault(); 

        const usuarioDigitado = document.getElementById('username').value;
        const senhaDigitada = document.getElementById('password').value;

        // Limpa mensagens anteriores
        mensagemDiv.classList.remove('hidden', 'erro', 'sucesso');

        if (usuarioDigitado === mockDatabase.usuarioAdmin && senhaDigitada === mockDatabase.senhaAdmin) {
            // Simulação de login com sucesso
            mensagemDiv.textContent = `Acesso autorizado. Bem-vindo, ${usuarioDigitado}!`;
            mensagemDiv.classList.add('sucesso');
            
            // Aqui você poderia redirecionar para um painel estático
            // window.location.href = "dashboard.html";
        } else {
            // Simulação de falha
            mensagemDiv.textContent = "Usuário ou senha incorretos.";
            mensagemDiv.classList.add('erro');
        }
    });
});