import time
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.staticfiles import StaticFiles
import os

from brain import processar_mensagem
from tts import gerar_audio

app = FastAPI()

if not os.path.exists("audio"):
    os.makedirs("audio")

app.mount("/web", StaticFiles(directory="web", html=True), name="web")

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
AUDIO_DIR = os.path.join(BASE_DIR, "audio")

print("AUDIO DIR:", AUDIO_DIR)

app.mount("/audio", StaticFiles(directory=AUDIO_DIR), name="audio")

class Message(BaseModel):
    text: str
    voice: str | None = "male"
    jarvis: bool = False


@app.post("/chat")
def chat(msg: Message):
    print("Recebi:", msg.text)

    resposta = processar_mensagem(msg.text, msg.jarvis)
    print("Resposta IA:", resposta)

    audio_url = None

    if msg.jarvis:
        voice = msg.voice or "male"

        audio_path = gerar_audio(resposta, voice)
        print("Audio gerado:", audio_path)

        audio_url = f"http://127.0.0.1:8000/{audio_path}?t={time.time()}"

    return {
        "response": resposta,
        "audio": audio_url
    }