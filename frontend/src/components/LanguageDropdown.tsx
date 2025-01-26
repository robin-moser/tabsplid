import {useState} from "react";
import {useTranslation} from 'react-i18next';
import {Languages} from 'lucide-react';
import {DE, GB} from 'country-flag-icons/react/3x2'

const LanguageDropdown = () => {

  const {t, i18n} = useTranslation(['common']);
  const [isOpen, setIsOpen] = useState(false);
  const languages = [
    {code: 'en', name: 'English', flag: GB},
    {code: 'de', name: 'German', flag: DE},
  ];

  const currentLang = i18n.language || window.localStorage.i18nextLng;
  const handleLanguageChange = (langCode: string) => {
    localStorage.setItem('i18nextLng', langCode);
    i18n.changeLanguage(langCode);
    setIsOpen(false);
  };

  return (
    <div>
      {isOpen && (
        <div className="absolute min-w-32 right-20 mr-2 p-2
          bg-white dark:bg-dark-200 shadow-lg rounded-lg z-10">
          {languages.map((lang) => {
            const Flag = lang.flag;
            return (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`flex items-center p-2 w-full rounded-lg transition-colors duration-200
                ${currentLang === lang.code ? 'bg-primary-500 text-white' : 'hover:bg-dark-300'}`}
              >
                <Flag className="w-6 mr-2 rounded-sm" />{lang.name}
              </button>
            );
          })}
        </div>
      )}
      <button
        onClick={() => setIsOpen(!isOpen)} aria-label={t('common:toggleLanguageSelection')}
        className="dark:bg-dark-100 bg-zinc-300 p-2 rounded-lg">
        <Languages size={20} />
      </button>

    </div>
  );
};

export default LanguageDropdown;
