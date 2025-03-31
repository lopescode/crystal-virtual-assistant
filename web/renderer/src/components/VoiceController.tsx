"use client";

import { useEffect, useRef, useState } from "react";

interface TVoiceControllerProps {
  setQuestion: (text: string) => void;
  setAnswer: (text: string) => void;
  askQuestion: (question: string) => void;
}

export const VoiceController = ({
  setQuestion,
  setAnswer,
  askQuestion,
}: TVoiceControllerProps) => {
  const [isListening, setIsListening] = useState(false);
  const [wasCancelled, setWasCancelled] = useState(false);
  const [wasFinalized, setWasFinalized] = useState(false);
  const [partialTranscript, setPartialTranscript] = useState("");

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if ("webkitSpeechRecognition" in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.lang = "pt-BR";
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);

      recognition.onresult = (event: any) => {
        if (wasCancelled) return;
        const transcript = event.results[0][0].transcript;
        setPartialTranscript((prev) => `${prev} ${transcript}`);
      };

      recognition.onerror = () => setIsListening(false);

      recognition.onend = () => {
        setIsListening(false);
        if (wasFinalized && !wasCancelled && partialTranscript.trim()) {
          const finalText = partialTranscript.trim();
          setQuestion(finalText);
          askQuestion(finalText);
          setPartialTranscript("");
        }
      };

      recognitionRef.current = recognition;

      const handleKeyDown = (e: KeyboardEvent) => {
        if (!recognitionRef.current) return;

        switch (e.key) {
          case "z":
            if (!isListening) {
              e.preventDefault();
              setWasCancelled(false);
              setWasFinalized(false);
              recognitionRef.current.start();
            }
            break;

          case "x":
            if (isListening) {
              e.preventDefault();
              setWasFinalized(false);
              recognitionRef.current.stop();
            }
            break;

          case "Enter":
            e.preventDefault();
            if (isListening) {
              setWasFinalized(true);
              recognitionRef.current.stop();
            } else if (partialTranscript.trim()) {
              const finalText = partialTranscript.trim();
              setQuestion(finalText);
              askQuestion(finalText);
              setPartialTranscript("");
            }
            break;

          case "c":
            if (isListening || partialTranscript) {
              e.preventDefault();
              setWasCancelled(true);
              setWasFinalized(false);
              recognitionRef.current.stop();
              setQuestion("");
              setAnswer("");
              setPartialTranscript("");
            }
            break;
        }
      };

      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    } else {
      console.warn("Reconhecimento de voz não suportado neste navegador.");
    }
  }, [
    isListening,
    wasFinalized,
    wasCancelled,
    partialTranscript,
    askQuestion,
    setQuestion,
    setAnswer,
  ]);

  return partialTranscript ? (
    <p className="text-gray-500 text-sm italic">Parcial: {partialTranscript}</p>
  ) : null;
};
