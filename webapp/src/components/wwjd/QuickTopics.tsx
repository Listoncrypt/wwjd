import { useLanguage } from "@/context/LanguageContext";

interface QuickTopicsProps {
  onSelect: (topic: string) => void;
}

export function QuickTopics({ onSelect }: QuickTopicsProps) {
  const { t } = useLanguage();

  const topics = [
    t('quickTopic1'),
    t('quickTopic2'),
    t('quickTopic3'),
    t('quickTopic4')
  ];

  return (
    <div className="w-full max-w-2xl mx-auto mb-4">
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <span className="text-xs font-medium text-muted-foreground whitespace-nowrap mr-2">
          {t('quickTopics')}:
        </span>
        {topics.map((topic, index) => (
          <button
            key={index}
            onClick={() => onSelect(`What does the Bible say about ${topic.toLowerCase()}?`)}
            className="px-3 py-1.5 text-xs font-medium bg-primary/5 hover:bg-primary/10 text-primary rounded-full transition-colors whitespace-nowrap border border-primary/10"
          >
            {topic}
          </button>
        ))}
      </div>
    </div>
  );
}
