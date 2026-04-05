import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

memoria = []

def processar_mensagem(texto, jarvis=False):
    global memoria

    if jarvis:
        system_prompt = """
        Você é um assistente de IA chamado Atlas.
        Fale de forma elegante, formal e respeitosa.
        Sempre trate o usuário como "Senhor".
        Seja direto, inteligente e levemente sofisticado.
        Evite mensagens longas ou complexas responda de forma clara e o mais curta possivel, tenha no máximo 50 palavras.
        """
    else:
        system_prompt = """
        Você é um assistente de IA chamado Atlas.
        Fale de forma elegante, formal e respeitosa.
        Sempre trate o usuário como "Senhor".
        Seja direto, inteligente e levemente sofisticado.
        """

    memoria.append({"role": "user", "content": texto})

    memoria = memoria[-8:]

    messages = [{"role": "system", "content": system_prompt}] + memoria

    chat_completion = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=messages,
        temperature=0.7
    )

    resposta = chat_completion.choices[0].message.content

    # salva resposta!!
    memoria.append({"role": "assistant", "content": resposta})

    return resposta