import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface QuestionInputProps {
  onSubmit: (question: string) => void;
  isLoading: boolean;
}

export function QuestionInput({ onSubmit, isLoading }: QuestionInputProps) {
  const [question, setQuestion] = useState("");
  const { t } = useLanguage();

  const handleSubmit = () => {
    if (question.trim() && !isLoading) {
      onSubmit(question.trim());
      setQuestion("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="relative">
        <Textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t('askPlaceholder')}
          className="min-h-[120px] pr-14 resize-none bg-card border-border/50 focus:border-primary/50 text-base leading-relaxed"
          disabled={isLoading}
        />
        <Button
          onClick={handleSubmit}
          disabled={!question.trim() || isLoading}
          size="icon"
          className="absolute bottom-3 right-3 h-10 w-10 rounded-full"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
      <p className="text-xs text-muted-foreground text-center mt-3">
        {t('pressEnter')}
      </p>
    </div>
  );
}
