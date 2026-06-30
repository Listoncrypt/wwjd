import { useSearchParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CrossIcon } from "@/components/wwjd/CrossIcon";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useLanguage } from "@/context/LanguageContext";
import { api } from "@/lib/api";

interface VerseData {
  chapter: number;
  verse: number;
  text: string;
}

interface VersesResponse {
  reference: string;
  verses: VerseData[];
}

const Verses = () => {
  const [searchParams] = useSearchParams();
  const verseRef = searchParams.get("ref") || "";
  const { t } = useLanguage();

  const { data, isLoading, error } = useQuery<VersesResponse>({
    queryKey: ["verses", verseRef],
    queryFn: async () => {
      // Use backend API
      const result = await api.get<VersesResponse>(`/api/verses?ref=${encodeURIComponent(verseRef)}`);
      return result;
    },
    enabled: !!verseRef,
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Subtle background pattern */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.015]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }}
      />

      {/* Main content */}
      <div className="relative z-10 px-4 py-8 md:py-12">
        {/* Theme and Language toggles */}
        <div className="absolute top-4 right-4 md:top-8 md:right-8 flex items-center gap-2">
          <LanguageSelector />
          <ThemeToggle />
        </div>

        {/* Back button */}
        <div className="max-w-2xl mx-auto mb-8">
          <Button
            variant="ghost"
            asChild
            className="text-muted-foreground hover:text-foreground"
          >
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('backToQuestions')}
            </Link>
          </Button>
        </div>

        {/* Header */}
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookOpen className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-cormorant text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight mb-2">
            {verseRef || t('holyScripture')}
          </h1>
          <p className="text-muted-foreground font-cormorant italic">
            {t('theWordOfGod')}
          </p>
        </header>

        {/* Loading state */}
        {isLoading ? (
          <div className="max-w-2xl mx-auto">
            <div className="bg-card rounded-xl border border-border/50 p-8 shadow-sm animate-pulse">
              <div className="flex items-center justify-center gap-3 mb-6">
                <CrossIcon className="w-6 h-6 text-primary/50 animate-pulse" />
                <span className="text-muted-foreground font-cormorant italic">
                  {t('loading')}
                </span>
              </div>
              <div className="space-y-4">
                <div className="h-6 bg-muted rounded w-3/4 mx-auto" />
                <div className="h-6 bg-muted rounded w-full" />
                <div className="h-6 bg-muted rounded w-5/6 mx-auto" />
              </div>
            </div>
          </div>
        ) : null}

        {/* Error state */}
        {error && !isLoading ? (
          <div className="max-w-2xl mx-auto">
            <div className="bg-card rounded-xl border border-destructive/30 p-8 shadow-sm text-center">
              <p className="text-destructive mb-4">
                {t('errorLoading')}
              </p>
              <Button asChild variant="outline">
                <Link to="/">{t('returnHome')}</Link>
              </Button>
            </div>
          </div>
        ) : null}

        {/* Verses display */}
        {data && !isLoading ? (
          <div className="max-w-2xl mx-auto">
            <div className="bg-card rounded-xl border border-border/50 overflow-hidden shadow-sm">
              {/* Reference header */}
              <div className="px-6 py-4 bg-primary/5 border-b border-border/30">
                <div className="flex items-center justify-center gap-2">
                  <CrossIcon className="w-5 h-5 text-primary" />
                  <span className="font-cormorant text-lg font-semibold text-primary">
                    {data.reference}
                  </span>
                </div>
              </div>

              {/* Verses content */}
              <div className="px-6 py-8 md:px-10 md:py-10">
                <div className="space-y-6">
                  {data.verses.map((verse, index) => (
                    <div key={index} className="group">
                      <p className="font-cormorant text-xl md:text-2xl leading-relaxed">
                        <span className="text-primary/60 font-semibold text-base mr-2 align-super">
                          {verse.chapter}:{verse.verse}
                        </span>
                        <span className="text-foreground/90">{verse.text}</span>
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Decorative footer */}
              <div className="px-6 py-4 bg-muted/30 border-t border-border/30">
                <p className="text-center text-sm text-muted-foreground font-cormorant italic">
                  "{t('psalmQuote')}"
                  <span className="block mt-1 text-xs not-italic">
                    - {t('psalmRef')}
                  </span>
                </p>
              </div>
            </div>

            {/* Ask another question CTA */}
            <div className="mt-8 text-center">
              <Button asChild variant="outline" className="font-cormorant">
                <Link to="/">
                  <CrossIcon className="w-4 h-4 mr-2" />
                  {t('askAnother')}
                </Link>
              </Button>
            </div>
          </div>
        ) : null}

        {/* No reference provided */}
        {!verseRef && !isLoading ? (
          <div className="max-w-2xl mx-auto">
            <div className="bg-card rounded-xl border border-border/50 p-8 shadow-sm text-center">
              <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4 font-cormorant text-lg">
                {t('noReference')}
              </p>
              <Button asChild>
                <Link to="/">{t('askQuestion')}</Link>
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Verses;
