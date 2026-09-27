
# Quintal dos Pets 🐾

Portal de gestão e autenticação com arquitetura orientada à segurança defensiva (*Secure by Design*). A solução opera com uma camada de perímetro no servidor web e mecanismos de proteção no cliente contra ataques cibernéticos comuns.

---

## 🛡️ Arquitetura e Controles de Segurança

* **Defesa em Profundidade (Perímetro HTTP):** Autenticação nativa em nível de servidor web via **Nginx HTTP Basic Auth** (`.htpasswd`), restringindo o acesso e ocultando a árvore de arquivos antes da autenticação.
* **Criptografia e Transporte Seguro:** Tráfego encapsulado via **HTTPS/TLS** com redirecionamento forçado da porta 80 (HTTP) para a porta 443 (HTTPS), incluindo cabeçalhos estritos de segurança (*HSTS*, *CSP*, *X-Frame-Options* e *X-Content-Type-Options*).
* **Proteção Criptográfica de Credenciais:** As chaves de acesso não trafegam nem ficam expostas em texto limpo no código-fonte; a checagem é executada via hash unidirecional **SHA-256** utilizando a Web Crypto API nativa do navegador.
* **Mitigação de Força Bruta (Anti-Brute Force):** Mecanismo de bloqueio com interrupção de acesso por **15 minutos** após **4 tentativas incorretas** consecutivas.
* **Prevenção a Cross-Site Scripting (Anti-XSS - OWASP A03):** Higienização e sanitização de entradas e saídas antes de qualquer renderização no DOM.

---

## 🚀 Tecnologias Utilizadas

* **Front-end:** HTML5 semântico, CSS3 responsivo e JavaScript (Vanilla ES6+).
* **Servidor Web & Proxy Reverso:** Nginx configurado com *SSL hardening* e *HTTP Basic Authentication*.
* **Infraestrutura em Nuvem:** AWS EC2 (Ubuntu Server), com Security Groups configurados para tráfego web seguro.

---

## ⚙️ Implantação e Execução

### 1. Clonar o Repositório
```bash
git clone [https://github.com/everton1206/Projeto_QuintaldosPets-web/everton1206/Projeto_QuintaldosPets.git](https://github.com/everton1206/Projeto_QuintaldosPets-web/everton1206/Projeto_QuintaldosPets.git)
cd Projeto_BompraCachorro_Pet
