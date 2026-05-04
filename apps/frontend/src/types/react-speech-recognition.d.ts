declare module "react-speech-recognition" {
  type StartListeningOptions = {
    continuous?: boolean;
    language?: string;
  };

  const SpeechRecognition: {
    startListening: (options?: StartListeningOptions) => Promise<void>;
    stopListening: () => Promise<void>;
  };

  export function useSpeechRecognition(): {
    transcript: string;
    finalTranscript: string;
    resetTranscript: () => void;
  };

  export default SpeechRecognition;
}
