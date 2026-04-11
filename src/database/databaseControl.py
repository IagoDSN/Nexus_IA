from src.database.connection import get_connection

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