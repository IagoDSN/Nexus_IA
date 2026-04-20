from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import HTTPBearer
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel

import time
import os
import datetime
from jose import jwt

from src.core.brain import processar_mensagem
from src.database.databaseControl import (
    get_all_users,
    get_user_memory,
    salvar_mensagem,
    limpar_memoria,
    get_last_messages,
    get_user_by_username,
    update_role
)
from src.routers.auth import (
    user_exists,
    criar_usuario,
    validar_username,
    verify_password,
    senha_forte
)
from src.services.tts import gerar_audio
from src.core.security import SECRET_KEY

# ================= CONFIG =================

ALGORITHM = "HS256"
app = FastAPI()

FRONTEND_DIST = os.path.join(os.getcwd(), "nexus-web", "dist")

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


# ================= AUTH =================

security = HTTPBearer()

def criar_token(data: dict):
    payload = data.copy()
    payload["exp"] = datetime.datetime.utcnow() + datetime.timedelta(hours=8)
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

def verificar_token(token=Depends(security)):
    try:
        # Certifique-se que o SECRET_KEY aqui é o mesmo usado na geração
        payload = jwt.decode(token.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except Exception as e:
        # Retorna 401 para o frontend saber que deve limpar o localStorage
        raise HTTPException(status_code=401, detail="Sessão expirada")


def verificar_admin(payload=Depends(verificar_token)):
    if payload.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Acesso negado")
    return payload

# ================= ADMIN =================

@app.get("/admin/stats")
def get_stats(user=Depends(verificar_token)):
    if user["role"] != "admin":
        raise HTTPException(403, "Acesso negado")
    
    users = get_all_users()
    messages = get_last_messages(20)
    
    return {
        "total_users": len(users),
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
        raise HTTPException(403, "Não pode banir admin")

    update_role(username, "banned")
    return {"msg": "Usuário banido"}


@app.post("/admin/unban")
def unban_user(data: dict, user=Depends(verificar_admin)):
    username = data.get("username")

    if not username:
        raise HTTPException(400, "Username obrigatório")

    update_role(username, "user")
    return {"msg": "Usuário desbanido"}

@app.post("/admin/promote")
def promote_user(data: dict, user=Depends(verificar_admin)):
    username = data.get("username")
    update_role(username, "admin")
    return {"msg": "Usuário promovido"}

@app.post("/admin/demote")
def demote_user(data: dict, user=Depends(verificar_token)):
    if user["role"] != "admin":
        raise HTTPException(403, "Acesso negado")
    
    username = data.get("username")
    if username == user["username"]:
        raise HTTPException(400, "Você não pode rebaixar a si mesmo")
        
    update_role(username, "user")
    return {"msg": f"Usuário {username} rebaixado para usuário comum"}
# ================= REGISTER =================

@app.post("/register")
def register(data: Register):

    if not validar_username(data.username):
        raise HTTPException(400, "Username inválido")

    ok, msg = senha_forte(data.password)
    if not ok:
        raise HTTPException(400, msg)

    if user_exists(data.email) or user_exists(data.username):
        raise HTTPException(400, "Usuário já existe")

    criar_usuario(data.username, data.email, data.password)

    return {"msg": "Usuário criado"}


# ================= LOGIN =================

@app.post("/login")
def login(data: Login):

    user = user_exists(data.login)

    if not user:
        raise HTTPException(401, "Usuário não existe")

    if not verify_password(data.password, user["password"]):
        raise HTTPException(401, "Senha incorreta")

    if user["role"] == "banned":
        raise HTTPException(403, "Usuário banido")

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

    memoria = get_user_memory(msg.username)

    resposta = processar_mensagem(
        msg.text,
        persona="atlas" if msg.voice == "male" else "luso",
        modo="continuo" if msg.jarvis else "normal",
        memoria_db=memoria,
        nome_usuario=msg.username
    )

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

# ================= SERVING FRONTEND =================
app.mount("/assets", StaticFiles(directory=os.path.join(FRONTEND_DIST, "assets")), name="assets")
app.mount("/audio", StaticFiles(directory="audio"), name="audio")

@app.get("/")
def serve_frontend():
    return FileResponse(os.path.join(FRONTEND_DIST, "index.html"))

@app.get("/{full_path:path}")
def serve_spa(full_path: str):

    if full_path.startswith(("admin", "login", "chat", "api")):
        raise HTTPException(status_code=404, detail="API endpoint not found")
        
    file_path = os.path.join(FRONTEND_DIST, full_path)
    if os.path.exists(file_path):
        return FileResponse(file_path)
        
    return FileResponse(os.path.join(FRONTEND_DIST, "index.html"))