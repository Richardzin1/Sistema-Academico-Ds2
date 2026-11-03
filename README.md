# Sistema Acadêmico - DS2

Sistema acadêmico full-stack desenvolvido para a disciplina Desenvolvimento de servidores 2. O projeto implementa o cadastro e listagem de alunos, utilizando arquitetura MVC (Model-View-Controller) em camadas tanto no frontend quanto no backend.

---

## 🚀 Tecnologias Utilizadas

- **Frontend:** HTML5, CSS3 e JavaScript ES6+ (Modular/MVC com `fetch`).
- **Backend:** Node.js com Express.
- **Outros:** CORS middleware, JSON parser e Versionamento Git/GitHub.

---

## 📁 Estrutura do Projeto

```text
sistema-academico-ds2/
├── backend/
│   └── src/
│       ├── controller/  # Regras de fluxo e respostas HTTP
│       ├── model/       # Estrutura e validações de dados
│       ├── routes/      # Definição dos endpoints
│       ├── app.js       # Configuração dos middlewares e Express
│       └── server.js    # Inicialização do servidor HTTP
├── frontend/            # Interface gráfica e integração via API
├── database/            # Scripts e dados de persistência
└── docs/                # Documentação e evidências do sistema