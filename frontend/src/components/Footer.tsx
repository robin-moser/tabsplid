import {useTranslation} from "react-i18next";

const Footer: React.FC = () => {

  const {t} = useTranslation(['common']);

  return (
    <footer className="flex items-center justify-between flex-col sm:flex-row
      px-4 py-6 mt-auto bg-neutral-200 dark:bg-dark-600 text-gray-500">
      <div className="flex-1"></div>
      <div className="mx-auto text-center relative">
        <span>&copy; {new Date().getFullYear()} tabsplid. {t('common:allRightsReserved')}</span>
      </div>
      <div className="text-right flex-1 min-w-24 text-gray-400 dark:text-gray-600">
        <span>{t('common:version')} {import.meta.env.VITE_APP_VERSION}</span>
      </div>
    </footer>
  );
}

export default Footer;
