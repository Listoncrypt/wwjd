import { CrossIcon } from "./CrossIcon";
import { useLanguage } from "@/context/LanguageContext";

export function LoadingState() {
  const { t } = useLanguage();

  return (
    <div className="w-full max-w-2xl mx-auto animate-fade-in">
      <div className="bg-card rounded-xl border border-border/50 overflow-hidden shadow-sm">
        <div className="px-6 py-8 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <CrossIcon className="w-8 h-8 text-primary animate-pulse-soft" />
            </div>
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground">{t('seekingWisdom')}</span>
              <span className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-primary rounded-full animate-typing" style={{ animationDelay: "0s" }} />
                <span className="w-1.5 h-1.5 bg-primary rounded-full animate-typing" style={{ animationDelay: "0.2s" }} />
                <span className="w-1.5 h-1.5 bg-primary rounded-full animate-typing" style={{ animationDelay: "0.4s" }} />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
