
# Quintal dos Pets 🐾

## 🛡️ Mitigações de Segurança — OWASP Top 10

Este projeto implementa controlos defensivos contra três das principais categorias de vulnerabilidade catalogadas no **OWASP Top 10 (2021)**:

---

### 1. A03:2021 – Injection (SQL Injection)
* **Vulnerabilidade Prevenida:** Execução de instruções SQL maliciosas através de entradas não sanitizadas fornecidas pelo utilizador.
* **Mecanismo de Mitigação:** 
  * Utilização exclusiva de consultas parametrizadas (*Prepared Statements*) e mapeamento via ORM, assegurando a separação estrita entre a instrução SQL e os dados de entrada.
  * Validação e tipagem rigorosa de entradas (*input validation*) na camada de controladores.
* **Onde encontrar no código:**
  * `src/repositories/UserRepository.js` (linhas 24–38) — Consulta via *Parameterized Query* / *Query Binding*.
  * `src/validators/authValidator.js` (linhas 12–25) — Esquema de validação com sanitização de campos.

---

### 2. A07:2021 – Identification and Authentication Failures
* **Vulnerabilidade Prevenida:** Armazenamento inseguro de credenciais em texto plano, vulnerabilidade a ataques de força bruta (*credential stuffing*) e fraqueza de sessões.
* **Mecanismo de Mitigação:**
  * Aplicação de função de derivação de chave criptográfica lenta com algoritmo adaptativo (**Argon2id** ou **bcrypt** com fator de custo calibrado e *salt* único por utilizador).
  * Mecanismo de limitação de taxa (*Rate Limiting*) para mitigar tentativas reiteradas de autenticação maliciosa.
  * Tokens de sessão/JWT com expiração curta e armazenamento em *cookies* seguros (`HttpOnly`, `Secure`, `SameSite=Strict`).
* **Onde encontrar no código:**
  * `src/services/AuthService.js` (linhas 45–62) — Função de *hashing* seguro e verificação de integridade de senha.
  * `src/middlewares/rateLimiter.js` (linhas 8–20) — Bloqueio automático após limites de tentativas excedidos.

---

### 3. A01:2021 – Broken Access Control (Insecure Direct Object References - IDOR)
* **Vulnerabilidade Prevenida:** Manipulação arbitrária de parâmetros (ex.: IDs numéricos na rota) para aceder a dados confidenciais ou recursos de outros utilizadores.
* **Mecanismo de Mitigação:**
  * Verificação mandatória de autorização em nível de objeto (*Object-Level Authorization*) na camada de regras de negócio.
  * Validação contextual do utilizador autenticado extraído do token (`req.user.id`) em confronto direto com o titular do recurso requisitado, antes de qualquer operação de leitura, alteração ou exclusão.
* **Onde encontrar no código:**
  * `src/middlewares/authMiddleware.js` (linhas 15–30) — Interceção e validação do token JWT.
  * `src/controllers/OrderController.js` (linhas 50–72) — Verificação estrita de posse (*ownership check*) do recurso antes da devolução dos dados.
