type OnResultCallback = (texto: string) => void;
type OnEndCallback = () => void;

export class VoiceManager {
    recognition: any;
    falando: boolean;
    escutando: boolean;
    ultimoTexto: string;
    ativo: boolean;

    constructor(onResult: OnResultCallback, onEnd?: OnEndCallback) {
        const SpeechRecognition =
            (window as any).SpeechRecognition ||
            (window as any).webkitSpeechRecognition;

        this.recognition = SpeechRecognition ? new SpeechRecognition() : null;

        this.falando = false;
        this.escutando = false;
        this.ultimoTexto = "";
        this.ativo = false;

        if (this.recognition) {
            this.recognition.lang = 'pt-BR';
            this.recognition.continuous = false;

            this.recognition.onresult = (e: any) => {
                if (this.falando) return;

                const texto = e.results[0][0].transcript.trim();

                if (texto === this.ultimoTexto) {
                    console.log("Ignorado repetido:", texto);
                    return;
                }

                this.ultimoTexto = texto;
                onResult(texto);
            };

            this.recognition.onend = () => {
                this.escutando = false;

                if (!this.ativo) return;
                if (this.falando) return;

                setTimeout(() => this.start(), 500);

                if (onEnd) onEnd();
            };
        }
    }

    start(): void {
        if (!this.recognition || this.escutando) return;

        this.ativo = true;

        try {
            this.recognition.start();
            this.escutando = true;
        } catch {}
    }

    stop(): void {
        if (!this.recognition) return;

        this.ativo = false;

        try {
            this.recognition.stop();
            this.escutando = false;
        } catch {}
    }

    tocarAudio(url: string, onAudioEnd?: () => void): void {
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