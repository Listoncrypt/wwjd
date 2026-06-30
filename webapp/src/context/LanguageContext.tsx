import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, t as translate, tArray as translateArray, TranslationKey } from '@/lib/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey) => string;
  tArray: (key: TranslationKey) => string[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'app-language';

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && ['en', 'fr', 'es', 'ig', 'yo'].includes(stored)) {
        return stored as Language;
      }
    }
    return 'en';
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, language);
  }, [language]);

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
  };

  const t = (key: TranslationKey): string => {
    return translate(language, key);
  };

  const tArray = (key: TranslationKey): string[] => {
    return translateArray(language, key);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, tArray }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
