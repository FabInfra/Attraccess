import i18nFactory from 'i18next';
import { initReactI18next, useTranslation } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { useEffect, useState } from 'react';

i18nFactory
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    fallbackLng: 'en',
    supportedLngs: ['en', 'de'],
    defaultNS: 'common',
    fallbackNS: 'common',

    interpolation: {
      escapeValue: false,
    },
  });

export const i18n = i18nFactory;

type TranslationRecord = Record<string, unknown>;

interface TranslationModule {
  default: TranslationRecord;
}

interface TranslationModules {
  en: TranslationModule | TranslationRecord;
  de: TranslationModule | TranslationRecord;
}

export function useTranslations<T extends TranslationModules>(
  namespace: string,
  translations: T
): ReturnType<typeof useTranslation> {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Add translations for each language
    Object.entries(translations).forEach(([lang, module]) => {
      if (!i18n.hasResourceBundle(lang, namespace)) {
        i18n.addResourceBundle(lang, namespace, module.default ?? module, true, true);
      }
    });
    setIsLoaded(true);

    // Cleanup when component unmounts
    return () => {
      Object.keys(translations).forEach((lang) => {
        i18n.removeResourceBundle(lang, namespace);
      });
    };
  }, [namespace, translations]);

  const translation = useTranslation(namespace);

  // Return empty strings for translations until loaded to prevent showing translation keys
  if (!isLoaded) {
    return {
      ...translation,
      t: () => '',
    } as ReturnType<typeof useTranslation>;
  }

  return translation;
}
