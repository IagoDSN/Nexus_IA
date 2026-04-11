export class VoiceManager {
    constructor(onResult, onEnd) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognition = SpeechRecognition ? new SpeechRecognition() : null;
        this.falando = false;

        if (this.recognition) {
            this.recognition.lang = 'pt-BR';
            this.recognition.continuous = true;
            this.recognition.onresult = (e) => !this.falando && onResult(e.results[0][0].transcript);
            this.recognition.onend = onEnd;
        }
    }

    start() { try { this.recognition.start(); } catch(e) {} }
    stop() { try { this.recognition.stop(); } catch(e) {} }

    tocarAudio(url, onAudioEnd) {
        this.falando = true;
        const audio = new Audio(url);
        audio.play();
        audio.onended = () => {
            this.falando = false;
            onAudioEnd();
        };
    }
}