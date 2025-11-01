import { useMemo } from 'react';
import { Language, translations } from '../utils/translations';

export function useTranslation(language: Language) {
  return useMemo(() => translations[language] || translations.en, [language]);
}
