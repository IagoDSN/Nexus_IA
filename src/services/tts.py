import subprocess

PIPER_PATH = "./piper/piper.exe"
MODEL_BR = "voices/br.onnx"
MODEL_PT = "voices/pt.onnx"

def gerar_audio(texto, voice="male"):

    filename = "audio/audio.wav"

    if not voice or voice not in ["male", "female"]:
        voice = "male"

    if voice == "female":
        model = MODEL_PT
    else:
        model = MODEL_BR

    print("VOICE:", voice)
    print("MODEL:", model)

    subprocess.run(
        [
            "./piper/piper.exe",
            "--model", model,
            "--output_file", filename
        ],
        input=texto,
        text=True
    )

    return filename