export class VoiceManager {
    constructor(onResult, onEnd) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognition = SpeechRecognition ? new SpeechRecognition() : null;

        this.falando = false;
        this.escutando = false;
        this.ultimoTexto = "";
        this.ativo = false;

        if (this.recognition) {
            this.recognition.lang = 'pt-BR';

            this.recognition.continuous = false;

            this.recognition.onresult = (e) => {
                if (this.falando) return;

                const texto = e.results[0][0].transcript.trim();

                // Não repetir
                if (texto === this.ultimoTexto) {
                    console.log("Ignorado repetido:", texto);
                    return;
                }

                this.ultimoTexto = texto;

                onResult(texto);
            };

            this.recognition.onend = () => {
                this.escutando = false;

                if (!this.ativo) {
                    console.log("Reconhecimento parado (ativo = false)");
                    return;
                }

                if (this.falando) return;

                setTimeout(() => {
                    this.start();
                }, 500);

                if (onEnd) onEnd();
            };
        }
    }

    start() {
    if (!this.recognition || this.escutando) return;

    this.ativo = true;

    try {
        this.recognition.start();
        this.escutando = true;
    } catch (e) {}
}

    stop() {
        if (!this.recognition) return;

        this.ativo = false;

        try {
            this.recognition.stop();
            this.escutando = false;
        } catch (e) { }
    }

    tocarAudio(url, onAudioEnd) {
        this.falando = true;

        this.stop();

        const audio = new Audio(url);
        audio.play();

        audio.onended = () => {
            this.falando = false;
            if (this.ativo) {
                this.start();
            }

            if (onAudioEnd) onAudioEnd();
        };
    }
}