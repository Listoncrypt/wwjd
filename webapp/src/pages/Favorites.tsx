import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Heart, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useLanguage } from "@/context/LanguageContext";
import { AnswerCard } from "@/components/wwjd/AnswerCard";
import { CrossIcon } from "@/components/wwjd/CrossIcon";

export default function Favorites() {
  const { t } = useLanguage();
  const [favorites, setFavorites] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("wwjd_favorites");
    if (saved) {
      try {
        setFavorites(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.015]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }}
      />
      <div className="relative z-10 px-4 py-8 md:py-12 flex-1 flex flex-col max-w-4xl mx-auto w-full">
        <div className="absolute top-4 right-4 md:top-8 md:right-8 flex items-center gap-2">
          <LanguageSelector />
          <ThemeToggle />
        </div>

        <div className="max-w-2xl mx-auto w-full mb-8">
          <Button
            variant="ghost"
            asChild
            className="text-muted-foreground hover:text-foreground"
          >
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('backToHome')}
            </Link>
          </Button>
        </div>

        <header className="text-center mb-12 shrink-0">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Heart className="w-8 h-8 text-primary fill-current" />
          </div>
          <h1 className="font-cormorant text-4xl md:text-5xl font-semibold tracking-tight mb-3">
            {t('favorites')}
          </h1>
        </header>

        <div className="flex-1 flex flex-col gap-6 mb-8 w-full">
          {favorites.length === 0 ? (
            <div className="text-center bg-card rounded-xl border border-border/50 p-12 shadow-sm">
              <BookOpen className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground font-cormorant text-xl">
                {t('noFavorites')}
              </p>
            </div>
          ) : (
            favorites.map((item, idx) => (
              <AnswerCard
                key={idx}
                question={item.question}
                answer={item.answer}
                verses={item.verses}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
