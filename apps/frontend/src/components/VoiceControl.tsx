import { useEffect } from "react";
//import SpeechRecognition, { useSpeechRecognition, } from "react-speech-recognition";
/*
type VoiceControlProps = {
  onCommand: (text: string) => void;
};

export default function VoiceControl({ onCommand }: VoiceControlProps) {
  const { transcript, finalTranscript, resetTranscript } = useSpeechRecognition();

  const startVoice = () =>
    SpeechRecognition.startListening({ continuous: true, language: "en-US" });

  const stopVoice = () => SpeechRecognition.stopListening();

  useEffect(() => {
    if (!finalTranscript) return;

    onCommand(finalTranscript.trim().toLowerCase());
    resetTranscript();
  }, [finalTranscript, onCommand, resetTranscript]);

  return (
    <div>
      <div className="small text-muted mb-2">Transcript: {transcript}</div>

      <button type="button" className="btn btn-outline-secondary" onClick={startVoice}>
        Start Voice
      </button>

      <button type="button" className="btn btn-outline-secondary" onClick={stopVoice}>
        Stop Voice
      </button>

      <button type="button" className="btn btn-outline-secondary" onClick={resetTranscript}>
        Clear
      </button>
    </div>
  );
}*/
