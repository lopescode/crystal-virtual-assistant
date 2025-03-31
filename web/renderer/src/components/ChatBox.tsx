"use client";

import ReactMarkdown from "react-markdown";

interface TChatBoxProps {
  answer: string;
  loading: boolean;
}

export const ChatBox = ({ answer, loading }: TChatBoxProps) => {
  return loading ? (
    <p>Carregando resposta...</p>
  ) : (
    <div className="mt-4">
      <h2 className="font-semibold text-lg">Resposta:</h2>
      <div className="bg-gray-100 mt-2 p-4 rounded-lg max-w-none min-h-50 text-black text-lg leading-relaxed prose prose-neutral">
        <ReactMarkdown>{answer}</ReactMarkdown>
      </div>
    </div>
  );
};
