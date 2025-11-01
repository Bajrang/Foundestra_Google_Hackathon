import React from 'react';
import { Button } from './ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from './ui/dropdown-menu';
import { Globe, ChevronDown } from 'lucide-react';
import { LANGUAGES, Language } from '../utils/translations';

interface LanguageSelectorProps {
  selectedLanguage: Language;
  onLanguageChange: (language: Language) => void;
}

export function LanguageSelector({ selectedLanguage, onLanguageChange }: LanguageSelectorProps) {
  const currentLanguage = LANGUAGES.find(lang => lang.code === selectedLanguage) || LANGUAGES[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-white"
        >
          <Globe className="w-4 h-4" />
          <span className="hidden sm:inline">{currentLanguage.nativeName}</span>
          <span className="sm:hidden">{currentLanguage.code.toUpperCase()}</span>
          <ChevronDown className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {LANGUAGES.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => onLanguageChange(language.code as Language)}
            className={`cursor-pointer ${
              selectedLanguage === language.code ? 'bg-purple-50 text-purple-700' : ''
            }`}
          >
            <div className="flex flex-col">
              <span className="font-medium">{language.nativeName}</span>
              <span className="text-xs text-gray-500">{language.name}</span>
            </div>
            {selectedLanguage === language.code && (
              <div className="ml-auto w-2 h-2 rounded-full bg-purple-600" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}