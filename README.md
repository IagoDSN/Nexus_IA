# <img src="https://api.iconify.design/lucide:zap.svg?color=%2300ffff" width="25" vertical-align="bottom"> Nexus AI

<div align="center">
  
![Status](https://img.shields.io/badge/Status-Em_desenvolvimento-red)
![Agent](https://img.shields.io/badge/AI_Agent-Autonomous-blueviolet?style=flat&logo=openai)
![Version](https://img.shields.io/badge/Version-0.1.0--beta-blue?style=flat-square)
![Licença](https://img.shields.io/github/license/IagoDSN/Nexus_IA?style=flat-square&color=important)
[![Ultimo Update](https://img.shields.io/github/last-commit/IagoDSN/Nexus_IA?label=Ultimo%20Update&style=classic)](https://github.com/IagoDSN/Nexus_IA)
</div>

Assistente inteligente com interface de chat e comando de voz contínuo. O projeto utiliza uma stack moderna focada em performance local e baixíssima latência.

## 🚀 Funcionalidades

* **Chat com IA:** Interface textual fluida, moderna e responsiva.
* **Modo chat continuo:** Reconhecimento de voz em tempo real com overlay.
* **Memória por usuário:** Conversas armazenadas no banco de dados (MySQL)
* **Sistema de login:** JWT (Sessão por usuário) + autenticação segura
* **Controle Administrativo:** Dashboard exclusivo para gerenciamento de usuários, bans e logs.
* **Personalidade Dinâmica:** Escolha entre (Voz Brasileira/Atlas) ou (Voz Portuguesa/Luso).
* **TTS Local com Piper:** Geração de voz extremamente rápida processada localmente no servidor com Piper.
* **Inteligência Groq:** Processamento de linguagem natural de alta velocidade via API.

## 🖼️ Preview da Interface

<p align="center">
  <img src="assets/loginPage.png" width="300"/>
</p>

<br>

## 🛠 Tecnologias Utilizadas

**Backend:**

![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![Groq](https://img.shields.io/badge/Groq-f55036?style=for-the-badge)
![MYSQL](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white)

**Frontend:**

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)

---

## ⚙️ Instalação

### 1. Clonar e Backend (Python)
```bash
# Clone o repositório
git clone https://github.com/IagoDSN/Nexus_IA
cd Nexus_IA

# Crie um ambiente virtual
python -m venv venv

# Ative o ambiente virtual
venv\Scripts\activate

# Instale as dependências
pip install -r requirements.txt
```

### 2. Frontend (Node.js & Vite)
O frontend é construído com TypeScript e Vite. Você precisa compilar os arquivos para o FastAPI servir a pasta dist.

```bash
# Navegue até a pasta do web app
cd nexus-web

# Instale as dependências do Node
npm install

# Gere o build de produção
npm run build

# Retorne para a raiz do projeto
cd ..
```
---

## 🗄️ Configuração do Banco de Dados

O projeto utiliza **MySQL/MariaDB**. Para configurar a estrutura necessária:

1. Certifique-se de ter um servidor MySQL rodando em sua máquina.
2. Localize o arquivo de script em: `BD/script.sql`.
3. Execute o script no seu gerenciador de banco de dados (HeidiSQL, MySQL Workbench, ou via terminal) para criar o banco `nexus` e as tabelas `users` e `memory`.

```bash
# Exemplo via terminal
mysql -u root -p < BD/script.sql
```

## 🔑 Configuração do ambiente
O projeto utiliza variáveis de ambiente para chaves de API e configurações sensíveis.

Atualize o arquivo **.env** na raiz do projeto com suas credenciais de banco de dados, a chave mestra de criptografia e o token de acesso à API do Groq.

```bash
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=nexus

SECRET_KEY=sua_chave_secreta

GROQ_API_KEY=sua_chave
```

## ▶️ Como Rodar
Com o ambiente configurado, inicie o servidor FastAPI:

```bash
uvicorn main:app --reload
```

Após iniciar, acesse a interface pelo navegador:
http://127.0.0.1:8000

## ⚠️ Importante

Piper TTS: Certifique-se de que os binários e modelos do Piper estão na pasta correta conforme configurado no main.py.

Build do Front: Sempre que fizer alterações nos arquivos .ts ou .css da pasta nexus-web, você deve rodar npm run build novamente para que as mudanças reflitam no servidor FastAPI.

Microfone: O navegador exige uma conexão segura (HTTPS ou localhost) para permitir o uso do microfone.

## Author

<div align="left">
  <code><strong>IagoDSN</strong></code> — <i>Full Stack Developer & AI Creator</i>
  <br>
  <img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/aqua.png" width="100%">
</div>

<br>

<div align="left">
  <a href="https://github.com/IagoDSN" target="_blank">
    <img src="https://img.shields.io/static/v1?label=GITHUB&message=FOLLOW&color=000&style=for-the-badge&logo=github" alt="Github">
  </a>
  <a href="https://www.linkedin.com/in/iago-nunes-2509a83ba" target="_blank">
    <img src="https://img.shields.io/static/v1?label=LINKEDIN&message=CONNECT&color=0077B5&style=for-the-badge&logo=linkedin" alt="Linkedin">
  </a>
  <a href="https://www.instagram.com/iago_sepini/" target="_blank">
    <img src="https://img.shields.io/static/v1?label=INSTAGRAM&message=SOCIAL&color=E4405F&style=for-the-badge&logo=instagram" alt="Instagram">
  </a>
</div>
