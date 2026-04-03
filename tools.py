import subprocess
import datetime

def executar_tool(texto):

    if "hora" in texto:
        return f"Agora são {datetime.datetime.now().strftime('%H:%M')}"

    if "abrir bloco de notas" in texto:
        subprocess.run(["notepad"])
        return "Abrindo bloco de notas."

    if "abrir calculadora" in texto:
        subprocess.run(["calc"])
        return "Abrindo calculadora."

    return None