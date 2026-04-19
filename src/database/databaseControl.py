from src.database.connection import get_connection

def get_total_users():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) FROM users")
    total = cursor.fetchone()[0]

    conn.close()
    return total

def get_all_users():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT username, email, role, dateCreated
        FROM users
    """)
    users = cursor.fetchall()
    conn.close()
    return users

def get_last_messages(limit=20):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT username, role, message, id
        FROM memory
        ORDER BY id DESC
        LIMIT %s
    """, (limit,))

    messages = cursor.fetchall()
    conn.close()

    messages.reverse()
    return messages

def salvar_mensagem(username, role, message):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "INSERT INTO memory (username, role, message) VALUES (%s, %s, %s)",
        (username, role, message)
    )

    conn.commit()
    conn.close()


# pegar memória
def get_user_memory(username, limite=6):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT role, message 
        FROM memory 
        WHERE username = %s 
        ORDER BY id DESC 
        LIMIT %s
    """, (username, limite))

    rows = cursor.fetchall()
    conn.close()

    rows.reverse()
    return rows


# limpar memória antiga
def limpar_memoria(username, limite=20):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        DELETE FROM memory 
        WHERE username = %s 
        AND id NOT IN (
            SELECT id FROM (
                SELECT id FROM memory 
                WHERE username = %s 
                ORDER BY id DESC 
                LIMIT %s
            ) temp
        )
    """, (username, username, limite))

    conn.commit()
    conn.close()

def update_role(username, role):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        UPDATE users
        SET role = %s
        WHERE username = %s
    """, (role, username))

    conn.commit()
    conn.close()

def get_user_by_username(username):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM users WHERE username = %s", (username,))
    user = cursor.fetchone()

    conn.close()
    return user