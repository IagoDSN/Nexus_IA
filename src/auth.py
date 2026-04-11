from src.connection import get_connection
import bcrypt
import re


def username_exists(username):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM users WHERE username = %s", (username,))
    user = cursor.fetchone()

    conn.close()
    return user is not None


def email_exists(email):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
    user = cursor.fetchone()

    conn.close()
    return user is not None


def criar_usuario(username, email, password):
    conn = get_connection()
    cursor = conn.cursor()

    senha_hash = bcrypt.hashpw(password.encode(), bcrypt.gensalt())

    cursor.execute(
        "INSERT INTO users (username, email, password, role) VALUES (%s, %s, %s, %s)",
        (username, email, senha_hash, "user")
    )

    conn.commit()
    conn.close()


def user_exists(login):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT * FROM users 
        WHERE email = %s OR username = %s
    """, (login, login))

    user = cursor.fetchone()

    cursor.close()
    conn.close()

    return user


def verify_password(password, hashed):
    return bcrypt.checkpw(password.encode(), hashed.encode())

def get_user_login(identifier):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute(
        "SELECT * FROM users WHERE email = %s OR username = %s",
        (identifier, identifier)
    )

    user = cursor.fetchone()
    conn.close()

    return user

def validar_username(username):
    if "@" in username or " " in username:
        return False

    return re.match(r'^[a-zA-Z0-9_]+$', username)

def senha_forte(senha: str):
    if len(senha) < 8:
        return False, "A senha deve ter no mínimo 8 caracteres"

    if not re.search(r"[A-Z]", senha):
        return False, "A senha deve ter pelo menos 1 letra maiúscula"

    if not re.search(r"[a-z]", senha):
        return False, "A senha deve ter pelo menos 1 letra minúscula"

    if not re.search(r"[0-9]", senha):
        return False, "A senha deve ter pelo menos 1 número"

    if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", senha):
        return False, "A senha deve ter pelo menos 1 caractere especial"

    return True, "Senha forte"