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
* **Memória por usuário** Conversas armazenadas no banco de dados (MySQL)
* **Sistema de login** JWT (Sessão por usuário) + autenticação segura
* **Personalidade Dinâmica:** Escolha entre (Voz Brasileira/Atlas) ou (Voz Portuguesa/Luso).
* **TTS Local com Piper:** Geração de voz extremamente rápida processada localmente no servidor com Piper.
* **Inteligência Groq:** Processamento de linguagem natural de alta velocidade via API.

## 🛠 Tecnologias Utilizadas

![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![Groq](https://img.shields.io/badge/Groq-f55036?style=for-the-badge)
![MYSQL](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white)



## ⚙️ Instalação

Siga os passos abaixo para configurar o ambiente:

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

## 🔑 Configuração
O projeto utiliza variáveis de ambiente para chaves de API e configurações sensíveis.

Adicione sua chave da API Groq no arquivo **.env**

```bash
DB_HOST=localhost
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
http://127.0.0.1:8000/web/index.html

## ⚠️ Importante

Piper TTS: Certifique-se de que os binários e modelos do Piper estão na pasta correta conforme configurado no main.py.

Microfone: O navegador exige uma conexão segura (HTTPS ou localhost) para permitir o uso do microfone.

## Desenvolvedor

<div>
  <h1>
    <a href="https://github.com/IagoDSN">IagoDSN</a>
  </h1>

  <div>
    <a href="https://www.linkedin.com/in/iago-nunes-2509a83ba" target="_blank">
      <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn">
    </a>
    <a href="https://www.instagram.com/iago_sepini/" target="_blank">
      <img src="https://img.shields.io/badge/Instagram-E4405F?style=for-the-badge&logo=instagram&logoColor=white" alt="Instagram">
    </a>
  </div>
  <br />
</div>
