import { useEffect, useMemo, useRef, useState } from "react";
import { Fab, Paper, Tooltip, Typography, Box } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import Draggable from "react-draggable";

type VoiceControlProps = {
  onCommand: (command: string) => boolean;
  buttonSx?: SxProps<Theme>;
};

const VOICE_LISTENING_KEY = "teamg.voiceListening";

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
}: VoiceControlProps) {
  const nodeRef = useRef<HTMLDivElement>(null);

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
    if (!recognition) return;

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
    sessionStorage.setItem(VOICE_LISTENING_KEY, "false");
    clearRestartTimer();
    cleanupRecognition();
    setIsListening(false);
    setStatus("Microphone is off.");
  };

  const startListening = () => {
    if (!SpeechRecognition) return;

    shouldListenRef.current = false;
    clearRestartTimer();
    cleanupRecognition();

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setStatus("Listening. Speak now.");
    recognition.onaudiostart = () => setStatus("Microphone connected.");
    recognition.onspeechstart = () => setStatus("Speech detected.");
    recognition.onnomatch = () =>
      setStatus("Speech heard, but not recognized.");

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
        const compactCommand = command.replace(/\s+/g, "");
        const stopKeywords = [
          "stopvoice",
          "turnoffvoice",
          "stoplistening",
          "microphoneoff",
        ];

        if (stopKeywords.some((kw) => compactCommand.includes(kw))) {
          stopListening();
          return;
        }

        const wasSuccessful = onCommand(command);
        if (wasSuccessful) {
          finalTranscriptRef.current =
            `${finalTranscriptRef.current} ${command}`.trim();
          setTranscript(finalTranscriptRef.current);
          setStatus("Command accepted.");
          if (shouldListenRef.current) setIsListening(true);
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
        setStatus("Microphone permission blocked.");
        return;
      }
      if (shouldListenRef.current) return;
      setIsListening(false);
    };

    recognition.onend = () => {
      if (shouldListenRef.current) {
        clearRestartTimer();
        restartTimerRef.current = window.setTimeout(() => {
          if (shouldListenRef.current) startRecognition(recognition);
          restartTimerRef.current = null;
        }, 250);
        return;
      }
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    shouldListenRef.current = true;
    sessionStorage.setItem(VOICE_LISTENING_KEY, "true");
    finalTranscriptRef.current = "";
    startRecognition(recognition);
    setTranscript("");
  };

  useEffect(() => {
    if (
      isSupported &&
      !isListening &&
      sessionStorage.getItem(VOICE_LISTENING_KEY) === "true"
    ) {
      startListening();
    }
  }, [isSupported, isListening]);

  const handleClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    // react-draggable applies transform: translate(x, y) relative to the
    // element's natural CSS position. We position the element with
    // bottom/right so it starts in the correct corner, then dragging
    // shifts it via transform from there. bounds="body" keeps it on screen.
    <Draggable
      nodeRef={nodeRef}
      bounds="body"
      handle=".drag-handle"
    >
      <Box
        ref={nodeRef}
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 1400,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          // Explicit width prevents the transcript panel from causing reflow
          // and shifting the drag anchor mid-drag
          width: "fit-content",
        }}
      >
        {isListening && (
          <Paper
            elevation={6}
            sx={{
              width: 320,
              maxWidth: "calc(100vw - 48px)",
              p: 2,
              mb: 2,
              borderRadius: 2,
              cursor: "default",
              userSelect: "none",
            }}
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
            <Typography
              variant="body2"
              sx={{ userSelect: "text" }}
            >
              {transcript || "Start speaking after the microphone turns on."}
            </Typography>
          </Paper>
        )}

        <Tooltip
          title={
            isSupported ?
              "Voice commands (drag to move)"
            : "Voice control not supported"
          }
        >
          <Box
            className="drag-handle"
            sx={{ "cursor": "grab", "&:active": { cursor: "grabbing" } }}
          >
            <Fab
              color={isListening ? "secondary" : "primary"}
              size="small"
              onClick={handleClick}
              disabled={!isSupported}
              sx={[...(Array.isArray(buttonSx) ? buttonSx : [buttonSx])]}
            >
              {isListening ?
                <MicOffIcon />
              : <MicIcon />}
            </Fab>
          </Box>
        </Tooltip>
      </Box>
    </Draggable>
  );
}
