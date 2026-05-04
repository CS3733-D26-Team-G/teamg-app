import { useEffect, useMemo, useRef, useState } from "react";
import { Fab, Paper, Tooltip, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";

type VoiceControlProps = {
  onCommand: (command: string) => boolean;
  buttonSx?: SxProps<Theme>;
  panelSx?: SxProps<Theme>;
  showPanel?: boolean;
};

type SpeechRecognitionResultLike = {
  readonly isFinal: boolean;
  readonly 0: {
    readonly transcript: string;
  };
};

type SpeechRecognitionEventLike = Event & {
  readonly resultIndex: number;
  readonly results: {
    readonly length: number;
    readonly [index: number]: SpeechRecognitionResultLike;
  };
};

type SpeechRecognitionErrorEventLike = Event & {
  readonly error?: string;
};

type SpeechRecognitionLike = EventTarget & {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  onaudiostart: (() => void) | null;
  onnomatch: (() => void) | null;
  onend: (() => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onspeechend: (() => void) | null;
  onspeechstart: (() => void) | null;
  onstart: (() => void) | null;
  start: () => void;
  stop: () => void;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

type SpeechWindow = Window &
  typeof globalThis & {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  };

export default function VoiceControl({
  onCommand,
  buttonSx,
  panelSx,
  showPanel = true,
}: VoiceControlProps) {
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const shouldListenRef = useRef(false);
  const finalTranscriptRef = useRef("");
  const restartTimerRef = useRef<number | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [status, setStatus] = useState("");

  const SpeechRecognition = useMemo(() => {
    const speechWindow = window as SpeechWindow;
    return (
      speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition
    );
  }, []);

  const isSupported = Boolean(SpeechRecognition);

  useEffect(() => {
    return () => {
      shouldListenRef.current = false;
      if (restartTimerRef.current) {
        window.clearTimeout(restartTimerRef.current);
      }
      recognitionRef.current?.stop();
    };
  }, []);

  const clearRestartTimer = () => {
    if (restartTimerRef.current) {
      window.clearTimeout(restartTimerRef.current);
      restartTimerRef.current = null;
    }
  };

  const cleanupRecognition = () => {
    const recognition = recognitionRef.current;
    if (!recognition) {
      return;
    }

    recognition.onstart = null;
    recognition.onaudiostart = null;
    recognition.onspeechstart = null;
    recognition.onnomatch = null;
    recognition.onresult = null;
    recognition.onerror = null;
    recognition.onend = null;
    recognition.stop();
    recognitionRef.current = null;
  };

  const startRecognition = (recognition: SpeechRecognitionLike) => {
    try {
      recognition.start();
      setIsListening(true);
      setStatus("Microphone is on.");
    } catch {
      setStatus("Voice control is already starting.");
    }
  };

  const stopListening = () => {
    shouldListenRef.current = false;
    clearRestartTimer();
    cleanupRecognition();
    setIsListening(false);
    setStatus("Microphone is off.");
  };

  const startListening = () => {
    if (!SpeechRecognition) {
      return;
    }

    shouldListenRef.current = false;
    clearRestartTimer();
    cleanupRecognition();

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setStatus("Listening. Speak now.");
    };

    recognition.onaudiostart = () => {
      setStatus("Microphone connected.");
    };

    recognition.onspeechstart = () => {
      setStatus("Speech detected.");
    };

    recognition.onnomatch = () => {
      setStatus("Speech was heard, but no transcript was recognized.");
    };

    recognition.onresult = (event) => {
      let finalTranscript = "";
      let interimTranscript = "";

      for (
        let index = event.resultIndex;
        index < event.results.length;
        index++
      ) {
        const result = event.results[index];
        if (result?.isFinal) {
          finalTranscript += result[0].transcript;
        } else {
          interimTranscript += result?.[0].transcript ?? "";
        }
      }

      const spokenText = interimTranscript.trim();
      const command = finalTranscript.trim().toLowerCase();
      if (command) {
        const wasSuccessful = onCommand(command);
        if (wasSuccessful) {
          finalTranscriptRef.current =
            `${finalTranscriptRef.current} ${command}`.trim();
          setTranscript(finalTranscriptRef.current);
          setStatus("Command accepted.");
        } else if (spokenText) {
          setStatus("Listening for a supported command.");
        }
      } else if (spokenText) {
        setStatus("Listening for a supported command.");
      }
    };

    recognition.onerror = (event) => {
      if (
        event.error === "not-allowed" ||
        event.error === "service-not-allowed"
      ) {
        shouldListenRef.current = false;
        setIsListening(false);
        setStatus(
          "Microphone permission is blocked. Allow it in your browser.",
        );
        return;
      }

      if (shouldListenRef.current) {
        setStatus(`Still listening. Last issue: ${event.error ?? "unknown"}.`);
        return;
      }
      setIsListening(false);
    };

    recognition.onend = () => {
      if (shouldListenRef.current) {
        clearRestartTimer();
        restartTimerRef.current = window.setTimeout(() => {
          if (shouldListenRef.current) {
            startRecognition(recognition);
          }
          restartTimerRef.current = null;
        }, 250);
        return;
      }
      setIsListening(false);
    };
    recognitionRef.current = recognition;
    shouldListenRef.current = true;
    finalTranscriptRef.current = "";
    startRecognition(recognition);
    setTranscript("");
  };
  const handleClick = () => {
    if (isListening) {
      stopListening();
      return;
    }
    startListening();
  };

  return (
    <>
      <Tooltip
        title={
          isSupported ? "Voice commands" : (
            "Voice control is not supported in this browser"
          )
        }
      >
        <span>
          <Fab
            color={isListening ? "secondary" : "primary"}
            size="small"
            onClick={handleClick}
            disabled={!isSupported}
            sx={[
              {
                position: "fixed",
                right: 24,
                bottom: 24,
                zIndex: 1400,
              },
              ...(Array.isArray(buttonSx) ? buttonSx : [buttonSx]),
            ]}
          >
            {isListening ?
              <MicOffIcon />
            : <MicIcon />}
          </Fab>
        </span>
      </Tooltip>
      {showPanel && isListening && (
        <Paper
          elevation={6}
          sx={[
            {
              position: "fixed",
              right: 24,
              bottom: 88,
              zIndex: 1400,
              width: 320,
              maxWidth: "calc(100vw - 48px)",
              p: 2,
              borderRadius: 2,
            },
            ...(Array.isArray(panelSx) ? panelSx : [panelSx]),
          ]}
        >
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block", mb: 0.5, fontWeight: 700 }}
          >
            Transcript
          </Typography>
          {status && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "block", mb: 1 }}
            >
              {status}
            </Typography>
          )}
          <Typography variant="body2">
            {transcript || "Start speaking after the microphone turns on."}
          </Typography>
        </Paper>
      )}
    </>
  );
}
