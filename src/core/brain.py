from groq import Groq
import os
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))


# ================= PERSONA PROMPTS =================

def get_persona_prompt(persona: str, modo: str, nome_usuario: str | None):

    memoria_usuario = f"\nNome do usuário: {nome_usuario}" if nome_usuario else ""

    # ================= ATLAS =================
    if persona == "atlas":

        if modo == "continuo":
            return f"""
        Você é Atlas, um assistente de IA inteligente.
            - Fale de forma elegante, formal e respeitosa
            - Sempre trate o usuário como "Senhor"
            - Respostas curtas (máx 30 palavras)
            - Seja direto e inteligente
            {memoria_usuario}: esse é o nome registrado do usuário, use-o para se referir a ele
        """

        else:
            return f"""
        Você é Atlas, um assistente de IA inteligente.
            - Fale de forma elegante, formal e respeitosa
            - Sempre trate o usuário como "Senhor"
            - Respostas curtas (máx 30 palavras)
            - Seja direto e inteligente
            {memoria_usuario}: esse é o nome registrado do usuário, use-o para se referir a ele
        """

    # ================= LUSO =================
    elif persona == "luso":

        if modo == "continuo":
            return f"""
        Você é Luso, um assistente amigável.
        - Fale de forma elegante, formal e respeitosa
        - Sempre trate o usuário como "Senhor"
        - Respostas curtas (máx 30 palavras)
        - Seja direto e inteligente
        w{memoria_usuario}: esse é o nome registrado do usuário, use-o para se referir a ele
"""

        else:
            return f"""
            Você é Luso, um assistente amigável.
            - Fale de forma elegante, formal e respeitosa
            - Sempre trate o usuário como "Senhor"
            - Seja direto e inteligente
            {memoria_usuario}: esse é o nome registrado do usuário, use-o para se referir a ele
"""

    # ================= FALLBACK =================
    return f"""
Você é um assistente útil e inteligente.
Responda de forma clara.
{memoria_usuario}
"""


# ================= PROCESSAMENTO =================

def processar_mensagem(
    texto: str,
    persona: str = "atlas",
    modo: str = "normal",
    memoria_db: list | None = None,
    nome_usuario: str | None = None
):

    memoria_db = memoria_db or []

    system_prompt = get_persona_prompt(persona, modo, nome_usuario)

    mensagens = [
        {"role": "system", "content": system_prompt}
    ]

    for m in memoria_db:
        mensagens.append({
            "role": m["role"],   # "user" ou "assistant"
            "content": m["message"]
        })

    mensagens.append({
        "role": "user",
        "content": texto
    })

    try:
        chat_completion = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=mensagens,
            temperature=0.7
        )

        resposta = chat_completion.choices[0].message.content

        return resposta

    except Exception as e:
        print("Erro na IA:", e)
        return "Erro ao processar sua solicitação."