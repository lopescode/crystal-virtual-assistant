"use client";

interface TInputFormProps {
  question: string;
  setQuestion: (text: string) => void;
  askQuestion: () => void;
}

export const InputForm = ({
  question,
  setQuestion,
  askQuestion,
}: TInputFormProps) => {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        askQuestion();
      }}
      className="flex flex-col gap-4"
    >
      <input
        className="p-2 border rounded-lg w-full text-lg"
        type="text"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Digite sua pergunta"
      />
      <button
        type="submit"
        className="bg-blue-600 py-2 rounded-xl w-full font-bold text-lg cursor-pointer"
      >
        Perguntar
      </button>
    </form>
  );
};
