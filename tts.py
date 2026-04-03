import subprocess
import uuid
import os

PIPER_PATH = "./piper/piper.exe"
MODEL_MALE = "voices/male.onnx"
MODEL_FEMALE = "voices/female.onnx"

def gerar_audio(texto, voice="male"):
    import subprocess
    import os

    filename = "audio/audio.wav"

    if not voice or voice not in ["male", "female"]:
        voice = "male"

    if voice == "female":
        model = "voices/female.onnx"
    else:
        model = "voices/male.onnx"

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