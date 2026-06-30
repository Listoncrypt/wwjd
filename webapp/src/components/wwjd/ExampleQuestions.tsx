import { useLanguage } from "@/context/LanguageContext";

interface ExampleQuestionsProps {
  onSelect: (question: string) => void;
}

export function ExampleQuestions({ onSelect }: ExampleQuestionsProps) {
  const { tArray, t } = useLanguage();
  const examples = tArray('exampleQuestions');

  return (
    <div className="w-full max-w-2xl mx-auto">
      <p className="text-sm text-muted-foreground text-center mb-4">
        {t('orTryThese')}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {examples.map((question, index) => (
          <button
            key={index}
            onClick={() => onSelect(question)}
            className="px-4 py-3 text-sm text-left bg-secondary/50 hover:bg-secondary border border-border/30 rounded-lg transition-colors duration-200"
          >
            {question}
          </button>
        ))}
      </div>
    </div>
  );
}
