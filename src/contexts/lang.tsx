import React, { createContext, useContext, useEffect, useState } from 'react';
import { SupportedLang, getAppLang, setAppLang } from '../i18n';

type LangContextType = {
  lang: SupportedLang;
  setLang: (l: SupportedLang) => Promise<void>;
};

const LangContext = createContext<LangContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<SupportedLang>('pt');

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const l = await getAppLang();
        if (mounted) setLangState(l);
      } catch (e) {
        // ignore
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const setLang = async (l: SupportedLang) => {
    await setAppLang(l);
    setLangState(l);
  };

  return <LangContext.Provider value={{ lang, setLang }}>{children}</LangContext.Provider>;
};

export function useLanguage() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
