"use client";

import { useEffect, useState } from "react";
import { VoiceController } from "@/components/VoiceController";
import { ChatBox } from "@/components/ChatBox";
import { InputForm } from "@/components/InputForm";

export default function Home() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const speakResponse = (text: string) => {
    if ("speechSynthesis" in window) {
      const synth = window.speechSynthesis;
      const voices = synth.getVoices();
      const jarvisLike = voices.find(
        (v) =>
          v.lang === "pt-BR" &&
          (v.name.includes("Daniel") ||
            v.name.includes("Matthew") ||
            v.name.includes("Google UK") ||
            v.name.includes("Google US"))
      );

      function stripMarkdown(text: string): string {
        return text
          .replace(/\*\*(.*?)\*\*/g, "$1") // negrito
          .replace(/\*(.*?)\*/g, "$1") // itálico
          .replace(/`(.*?)`/g, "$1") // código inline
          .replace(/~~(.*?)~~/g, "$1") // tachado
          .replace(/#+\s?(.*)/g, "$1") // títulos
          .replace(/!\[.*?\]\(.*?\)/g, "") // imagens
          .replace(/\[.*?\]\(.*?\)/g, "") // links
          .replace(/> (.*)/g, "$1") // blockquote
          .replace(/[-+*] (.*)/g, "$1") // listas
          .replace(/\n+/g, " ") // quebras de linha → espaço
          .trim();
      }

      const utterance = new SpeechSynthesisUtterance(stripMarkdown(text));
      utterance.lang = jarvisLike?.lang || "pt-BR";
      utterance.voice = jarvisLike || voices[0];
      utterance.rate = 1;
      utterance.pitch = 0.9;

      synth.speak(utterance);
    }
  };

  const askQuestion = async (input: string) => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3001/ask-ia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: input }),
      });
      const text = await res.text();
      setAnswer(text);
      speakResponse(text);
    } catch (err) {
      console.error("Erro ao perguntar:", err);
      setAnswer("Erro ao consultar a IA.");
    } finally {
      setLoading(false);
      setQuestion("");
    }
  };

  useEffect(() => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
  }, []);

  return (
    <main className="flex flex-col gap-8 px-20 py-10">
      <h1 className="font-semibold text-3xl">🤖 Crystal Assistant</h1>

      <VoiceController
        setQuestion={setQuestion}
        setAnswer={setAnswer}
        askQuestion={askQuestion}
      />

      <InputForm
        question={question}
        setQuestion={setQuestion}
        askQuestion={() => askQuestion(question)}
      />

      <ChatBox answer={answer} loading={loading} />
    </main>
  );
}
