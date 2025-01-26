import {Sun, Moon} from "lucide-react";
import {useTranslation} from "react-i18next";
import LanguageDropdown from "./LanguageDropdown";

const Header: React.FC<{
  toggleDarkMode: () => void;
  isDarkMode: boolean
  showHeaderBorder?: boolean;
}> = ({toggleDarkMode, isDarkMode, showHeaderBorder}) => {

  const {t} = useTranslation(['common']);

  return (
    <header className={`
      ${showHeaderBorder ? "border-b-2" : ""}
      p-6 text-center border-neutral-200 dark:border-dark-400
  `}>
      <div className="flex items-center justify-between">
        <div className="sm:flex-1 hidden sm:block" />
        <a href="/">
          <img alt={t('common:tabsplidLogo')} src="/tabsplid.svg" className="w-52 mx-auto"></img>
        </a>
        <div className="top-6 right-6 flex gap-2 sm:flex-1 self-start justify-end">
          <LanguageDropdown />
          <button onClick={toggleDarkMode} aria-label={t('common:toggleDarkMode')}
            className="dark:bg-dark-100 bg-zinc-300 p-2 rounded-lg">
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </div>
    </header >
  );
}

export default Header;
