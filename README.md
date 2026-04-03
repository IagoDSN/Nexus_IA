# Nexus AI

Assistente inteligente com interface de chat e comando de voz contínuo, inspirado no sistema **Jarvis**. O projeto utiliza uma stack moderna focada em performance local e baixíssima latência.

## 🚀 Funcionalidades

* **Chat com IA:** Interface textual fluida, moderna e responsiva.
* **Modo Jarvis:** Reconhecimento de voz em tempo real com overlay visual de "bola voadora" (Orb).
* **Personalidade Dinâmica:** Escolha entre **Jarvis** (Voz Masculina/Ciano) e **Friday** (Voz Feminina/Rosa).
* **TTS Local com Piper:** Geração de voz extremamente rápida processada localmente no servidor.
* **Inteligência Groq:** Processamento de linguagem natural de alta velocidade via API.

## ⚙️ Instalação

Siga os passos abaixo para configurar o ambiente:

```bash
# Clone o repositório
git clone [https://github.com/seu-usuario/seu-repo.git](https://github.com/seu-usuario/seu-repo.git)
cd Agente_De_IA

# Crie um ambiente virtual
python -m venv venv

# Ative o ambiente virtual
# No Windows:
venv\Scripts\activate
# No Linux/Mac:
source venv/bin/activate

# Instale as dependências
pip install -r requirements.txt
```

## 🔑 Configuração
O projeto utiliza variáveis de ambiente para chaves de API e configurações sensíveis.

Crie um arquivo chamado .env na raiz do projeto.

Adicione sua chave da API Groq

```bash
GROQ_API_KEY=sua_chave_aqui_da_groq
```

# ▶️ Como Rodar
Com o ambiente configurado, inicie o servidor FastAPI:

```bash
uvicorn main:app --reload
```

Após iniciar, acesse a interface pelo navegador:
👉 http://127.0.0.1:8000/web/index.html

# ⚠️ Importante

Piper TTS: Certifique-se de que os binários e modelos do Piper estão na pasta correta conforme configurado no main.py.

Microfone: O navegador exige uma conexão segura (HTTPS ou localhost) para permitir o uso do microfone.


Desenvolvido por Iago Nunes