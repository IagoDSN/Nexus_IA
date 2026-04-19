from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.security import HTTPBearer
from pydantic import BaseModel
from fastapi.staticfiles import StaticFiles
import time
import os
from jose import jwt
import datetime

from src.core.brain import processar_mensagem
from src.database.databaseControl import get_all_users, get_user_memory, salvar_mensagem, limpar_memoria, get_last_messages, get_user_by_username, update_role
from src.routers.auth import user_exists, criar_usuario, validar_username, verify_password, senha_forte
from src.services.tts import gerar_audio
from src.core.security import SECRET_KEY


ALGORITHM = "HS256"

app = FastAPI()

app.mount("/web", StaticFiles(directory="web"), name="web")
app.mount("/audio", StaticFiles(directory="audio"), name="audio")


# ================= MODELS =================

class Register(BaseModel):
    username: str
    email: str
    password: str

class Login(BaseModel):
    login: str
    password: str

class Message(BaseModel):
    text: str
    username: str
    jarvis: bool = False
    voice: str = "male"

# ================= Functions =================

security = HTTPBearer()
def criar_token(data: dict):
    payload = data.copy()
    payload["exp"] = datetime.datetime.utcnow() + datetime.timedelta(hours=8)

    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    return token

def verificar_token(token=Depends(security)):
    try:
        payload = jwt.decode(token.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except:
        raise HTTPException(status_code=401, detail="Token inválido")
    
def verificar_admin(payload=Depends(verificar_token)):
    print("PAYLOAD:", payload)

    if payload.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Acesso negado")

    return payload

# ================= ADMIN =================

@app.get("/admin/stats")
def admin_stats(user=Depends(verificar_admin)):

    users_db = get_all_users()
    total_users = len(users_db)

    users = [
        {
            "username": u["username"],
            "email": u["email"],
            "role": u.get("role", "user"),
            "dateCreated": (
                u["dateCreated"].isoformat()
                if u.get("dateCreated")
                else None
            )
        }
        for u in users_db
    ]

    messages = get_last_messages(limit=20)

    return {
        "total_users": total_users,
        "users": users,
        "recent_messages": messages
    }

@app.post("/admin/ban")
def ban_user(data: dict, user=Depends(verificar_admin)):

    username = data.get("username")

    if not username:
        raise HTTPException(400, "Username obrigatório")

    target = get_user_by_username(username)

    if not target:
        raise HTTPException(404, "Usuário não encontrado")
    
    if target["role"] == "admin":
        raise HTTPException(403, "Não é possível banir um administrador")

    update_role(username, "banned")

    return {"msg": "Usuário banido"}

@app.post("/admin/unban")
def unban_user(data: dict, user=Depends(verificar_admin)):
    username = data.get("username")

    if not username:
        raise HTTPException(400, "Username obrigatório")

    update_role(username, "user")

    return {"msg": "Usuário desBanido"}

@app.post("/admin/promote")
def promote_user(data: dict, user=Depends(verificar_admin)):

    username = data.get("username")

    if not username:
        raise HTTPException(400, "Username obrigatório")

    target = get_user_by_username(username)

    if not target:
        raise HTTPException(404, "Usuário não encontrado")

    if target["role"] == "admin":
        raise HTTPException(400, "Usuário já é admin")

    update_role(username, "admin")

    return {"msg": "Usuário promovido a admin"}

@app.post("/admin/demote")
def demote_user(data: dict, user=Depends(verificar_admin)):

    username = data.get("username")

    if username == user["username"]:
        raise HTTPException(400, "Você não pode remover seu próprio admin")

    update_role(username, "user")

    return {"msg": "Admin removido"}

# ================= REGISTER =================

@app.post("/register")
def register(data: Register):

    # validar username
    if not validar_username(data.username):
        raise HTTPException(status_code=400, detail="Username inválido")

    # validar senha
    ok, msg = senha_forte(data.password)
    if not ok:
        raise HTTPException(status_code=400, detail=msg)

    # verificar duplicado
    if user_exists(data.email) or user_exists(data.username):
        raise HTTPException(status_code=400, detail="Usuário ou email já existe")

    criar_usuario(data.username, data.email, data.password)

    return {"msg": "Usuário criado com sucesso"}


# ================= LOGIN =================

@app.post("/login")
def login(data: Login):

    user = user_exists(data.login)

    if not user:
        raise HTTPException(status_code=401, detail="Usuário não existe")

    if not verify_password(data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Senha incorreta")

    if user["role"] == "banned":
        raise HTTPException(status_code=403, detail="Usuário banido")

    token = criar_token({
        "username": user["username"],
        "role": user["role"]
    })

    return {
        "token": token,
        "username": user["username"],
        "role": user["role"]
    }

# ================= CHAT =================

@app.post("/chat")
def chat(msg: Message, user=Depends(verificar_token)):
    print(f"Recebi de {msg.username}: {msg.text}")

    memoria = get_user_memory(msg.username)

    resposta = processar_mensagem(
        msg.text,
        persona="atlas" if msg.voice == "male" else "luso",
        modo="continuo" if msg.jarvis else "normal",
        memoria_db=memoria,
        nome_usuario=msg.username
    )

    print("Resposta IA:", resposta)

    salvar_mensagem(msg.username, "user", msg.text)
    salvar_mensagem(msg.username, "assistant", resposta)

    limpar_memoria(msg.username)

    audio_url = None

    if msg.jarvis:
        audio_path = gerar_audio(resposta, msg.voice)
        audio_url = f"http://127.0.0.1:8000/{audio_path}?t={time.time()}"

    return {
        "response": resposta,
        "audio": audio_url
    }