import { Link } from "react-router-dom";
import { CrossIcon } from "./CrossIcon";
import { useLanguage } from "@/context/LanguageContext";
import { Heart, Share, Volume2 } from "lucide-react";
import { useState, useEffect } from "react";
import html2canvas from "html2canvas";
import { useToast } from "@/hooks/use-toast";

interface AnswerCardProps {
  question: string;
  answer: string;
  verses?: string[];
}

export function AnswerCard({ question, answer, verses }: AnswerCardProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isSaved, setIsSaved] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    // Check if this specific answer is saved
    const saved = localStorage.getItem("wwjd_favorites");
    if (saved) {
      try {
        const favorites = JSON.parse(saved);
        if (favorites.some((fav: any) => fav.question === question && fav.answer === answer)) {
          setIsSaved(true);
        }
      } catch (e) {}
    }
  }, [question, answer]);

  const handleSave = () => {
    try {
      const savedStr = localStorage.getItem("wwjd_favorites");
      let favorites = savedStr ? JSON.parse(savedStr) : [];
      
      if (isSaved) {
        favorites = favorites.filter((fav: any) => !(fav.question === question && fav.answer === answer));
        setIsSaved(false);
      } else {
        favorites.push({ question, answer, verses });
        setIsSaved(true);
        toast({
          title: t('saved'),
          description: "Added to your favorites.",
        });
      }
      localStorage.setItem("wwjd_favorites", JSON.stringify(favorites));
    } catch (e) {
      console.error("Could not save favorite", e);
    }
  };

  const handleListen = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(answer);
    utterance.onend = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleShare = async () => {
    const card = document.getElementById(`answer-card-${question.substring(0, 10).replace(/[^a-zA-Z0-9]/g, "")}`);
    if (card) {
      try {
        const canvas = await html2canvas(card, { scale: 2, backgroundColor: null });
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], "wwjd-answer.png", { type: "image/png" });
            if (navigator.canShare && navigator.canShare({ files: [file] })) {
              navigator.share({
                files: [file],
                title: "What Would Jesus Do?",
                text: "Here is an answer I found on WWJD.",
              }).catch(() => {
                // fallback to download
                downloadImage(canvas.toDataURL("image/png"));
              });
            } else {
              downloadImage(canvas.toDataURL("image/png"));
            }
          }
        });
      } catch (e) {
        console.error("Error generating share image", e);
      }
    }
  };

  const downloadImage = (dataUrl: string) => {
    const link = document.createElement('a');
    link.download = 'wwjd-answer.png';
    link.href = dataUrl;
    link.click();
  };

  return (
    <div className="w-full max-w-2xl mx-auto animate-fade-in" id={`answer-card-${question.substring(0, 10).replace(/[^a-zA-Z0-9]/g, "")}`}>
      <div className="bg-card rounded-xl border border-border/50 overflow-hidden shadow-sm">
        {/* Question section */}
        <div className="px-6 py-4 bg-secondary/30 border-b border-border/30">
          <p className="text-sm text-muted-foreground mb-1">{t('yourQuestion')}</p>
          <p className="font-medium">{question}</p>
        </div>

        {/* Answer section */}
        <div className="px-6 py-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <CrossIcon className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-lg font-cormorant leading-relaxed whitespace-pre-wrap">
                {answer}
              </p>
            </div>
          </div>
        </div>

        {/* Bible verses section */}
        {verses && verses.length > 0 ? (
          <div className="px-6 py-4 bg-muted/30 border-t border-border/30">
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
              {t('relatedScripture')}
            </p>
            <div className="flex flex-wrap gap-2">
              {verses.map((verse, index) => (
                <Link
                  key={index}
                  to={`/verses?ref=${encodeURIComponent(verse)}`}
                  className="inline-block px-3 py-1 text-sm bg-primary/10 text-primary rounded-full font-medium hover:bg-primary/20 transition-colors cursor-pointer"
                >
                  {verse}
                </Link>
              ))}
            </div>
          </div>
        ) : null}

        {/* Action Bar */}
        <div className="px-6 py-3 bg-secondary/20 flex items-center justify-end gap-2 border-t border-border/30">
          <button
            onClick={handleListen}
            className={`p-2 rounded-full transition-colors flex items-center gap-1.5 text-xs font-medium ${isSpeaking ? 'bg-primary/20 text-primary' : 'hover:bg-muted text-muted-foreground hover:text-foreground'}`}
            title={t('listen')}
          >
            <Volume2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleSave}
            className={`p-2 rounded-full transition-colors flex items-center gap-1.5 text-xs font-medium ${isSaved ? 'text-red-500 hover:bg-red-500/10' : 'hover:bg-muted text-muted-foreground hover:text-foreground'}`}
            title={t('save')}
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={handleShare}
            className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5 text-xs font-medium"
            title={t('share')}
          >
            <Share className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
