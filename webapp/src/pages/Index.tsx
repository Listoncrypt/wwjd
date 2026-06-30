import { useState, useEffect, useRef } from "react";
import { QuestionInput } from "@/components/wwjd/QuestionInput";
import { AnswerCard } from "@/components/wwjd/AnswerCard";
import { LoadingState } from "@/components/wwjd/LoadingState";
import { ExampleQuestions } from "@/components/wwjd/ExampleQuestions";
import { QuickTopics } from "@/components/wwjd/QuickTopics";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/context/LanguageContext";
import { api } from "@/lib/api";
import { Twitter, Trash2, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const INSPIRATIONAL_VERSES = [
  { text: "Ask, and it shall be given you", reference: "Matthew 7:7" },
  { text: "For I know the plans I have for you", reference: "Jeremiah 29:11" },
  { text: "I can do all things through Christ who strengthens me", reference: "Philippians 4:13" },
  { text: "The Lord is my shepherd; I shall not want", reference: "Psalm 23:1" },
  { text: "Be strong and courageous", reference: "Joshua 1:9" },
  { text: "Trust in the Lord with all your heart", reference: "Proverbs 3:5" },
  { text: "The truth shall set you free", reference: "John 8:32" },
  { text: "Love one another as I have loved you", reference: "John 15:12" },
];

interface Answer {
  question: string;
  answer: string;
  verses: string[];
}

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<Answer[]>(() => {
    const saved = sessionStorage.getItem("wwjd_conversation_history");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });
  
  const [verseIndex, setVerseIndex] = useState(0);
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const bottomRef = useRef<HTMLDivElement>(null);

  const currentVerse = INSPIRATIONAL_VERSES[verseIndex];
  
  // Calculate Verse of the Day based on day of year
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
  const verseOfTheDay = INSPIRATIONAL_VERSES[dayOfYear % INSPIRATIONAL_VERSES.length];

  // Auto-rotate verses every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setVerseIndex((prev) => (prev + 1) % INSPIRATIONAL_VERSES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    sessionStorage.setItem("wwjd_conversation_history", JSON.stringify(conversationHistory));
    // Scroll to bottom when new messages arrive
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversationHistory]);

  const handleAskQuestion = async (question: string) => {
    setIsLoading(true);

    try {
      // Build history payload for the backend API
      const historyPayload = conversationHistory.flatMap(item => [
        { role: "user", parts: [{ text: item.question }] },
        { role: "model", parts: [{ text: JSON.stringify({ answer: item.answer, verses: item.verses }) }] }
      ]);

      // Use backend API
      const result = await api.post<{ answer: string; verses: string[] }>('/api/ask', {
        question,
        language,
        history: historyPayload
      });

      setConversationHistory(prev => [...prev, {
        question,
        answer: result.answer,
        verses: result.verses || [],
      }]);
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Please try again in a moment.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setConversationHistory([]);
    sessionStorage.removeItem("wwjd_conversation_history");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Subtle background pattern */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.015]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }}
      />

      {/* Main content */}
      <div className="relative z-10 px-4 py-8 md:py-16 flex-1 flex flex-col max-w-4xl mx-auto w-full">
        {/* Theme and Language toggles */}
        <div className="absolute top-4 right-4 md:top-8 md:right-8 flex items-center gap-2">
          {conversationHistory.length > 0 && (
            <Button variant="outline" size="icon" onClick={handleClearChat} title="Clear Chat">
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
          <Button variant="outline" size="icon" asChild title={t('favorites')}>
            <Link to="/favorites">
              <Heart className="w-4 h-4" />
            </Link>
          </Button>
          <LanguageSelector />
          <ThemeToggle />
        </div>

        {/* Header */}
        <header className="text-center mb-8 md:mb-12 shrink-0">
          <h1 className="font-cormorant text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight mb-3">
            {t('title')}
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl font-cormorant italic transition-opacity duration-500">
            "{currentVerse.text}" — {currentVerse.reference}
          </p>
          <div className="flex justify-center gap-1 mt-3">
            {INSPIRATIONAL_VERSES.map((_, idx) => (
              <span
                key={idx}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  idx === verseIndex ? "bg-primary" : "bg-muted-foreground/30"
                }`}
              />
            ))}
          </div>
        </header>

        {/* Chat History */}
        <div className="flex-1 flex flex-col gap-6 mb-8">
          {conversationHistory.map((item, idx) => (
            <div key={idx}>
              <AnswerCard
                question={item.question}
                answer={item.answer}
                verses={item.verses}
              />
            </div>
          ))}
          
          {/* Loading state */}
          {isLoading && (
            <div className="mt-4">
              <LoadingState />
            </div>
          )}
          
          <div ref={bottomRef} />
        </div>

        {/* Example questions and Verse of the Day (show when no history) */}
        {conversationHistory.length === 0 && !isLoading && (
          <div className="mb-12 shrink-0 flex flex-col gap-8">
            <div className="w-full max-w-2xl mx-auto bg-primary/5 rounded-xl border border-primary/10 p-6 text-center shadow-sm">
              <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">
                {t('verseOfTheDay')}
              </p>
              <p className="text-xl md:text-2xl font-cormorant italic text-foreground/90 mb-2">
                "{verseOfTheDay.text}"
              </p>
              <p className="text-sm text-muted-foreground font-medium">
                {verseOfTheDay.reference}
              </p>
            </div>
            <ExampleQuestions onSelect={handleAskQuestion} />
          </div>
        )}

        {/* Question input */}
        <div className="mt-auto shrink-0 sticky bottom-6 z-20">
          <QuickTopics onSelect={handleAskQuestion} />
          <QuestionInput onSubmit={handleAskQuestion} isLoading={isLoading} />
        </div>

        {/* Footer */}
        <footer className="text-center mt-12 md:mt-16 shrink-0 flex flex-col items-center">
          <p className="text-sm text-muted-foreground mb-4">
            {t('footerText')}
          </p>
          <div className="flex items-center gap-4">
            <Button variant="outline" className="rounded-full gap-2 text-primary font-medium hover:bg-primary hover:text-white transition-colors border-primary">
              <Heart className="w-4 h-4 fill-current" />
              Support Us
            </Button>
            <a
              href="https://x.com/listoncrypt"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-muted hover:bg-muted/80 transition-colors"
            >
              <Twitter className="w-5 h-5 text-muted-foreground" />
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
