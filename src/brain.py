from groq import Groq
import os
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def processar_mensagem(texto, jarvis=False, memoria_db=None, nome_usuario=None):

    memoria_db = memoria_db or []

    memoria_usuario = f"\nNome do usuário: {nome_usuario}" if nome_usuario else ""

    if jarvis:
        system_prompt = f"""
            Você é Atlas, um assistente de IA inteligente.
            - Fale de forma elegante, formal e respeitosa
            - Sempre trate o usuário como "Senhor"
            - Respostas curtas (máx 30 palavras)
            - Seja direto e inteligente
            {memoria_usuario}: esse é o nome registrado do usuário, use-o para se referir a ele
            """
    else:
        system_prompt = f"""
        Você é Atlas, um assistente de IA inteligente.
        - Fale de forma elegante, formal e respeitosa
        - Sempre trate o usuário como "Senhor"
        - Responda de forma clara e útil
        {memoria_usuario}: esse é o nome registrado do usuário, use-o para se referir a ele
"""

    mensagens = [{"role": "system", "content": system_prompt}]

    for m in memoria_db:
        mensagens.append({
            "role": m["role"],
            "content": m["message"]
        })

    mensagens.append({
        "role": "user",
        "content": texto
    })

    chat_completion = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=mensagens,
        temperature=0.7
    )

    resposta = chat_completion.choices[0].message.content

    return resposta