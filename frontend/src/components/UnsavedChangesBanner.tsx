import {useTranslation} from "react-i18next";

interface UnsavedChangesBannerProps {
  onSaveChanges: () => void;
  hasUnsavedChanges: boolean;
  loading: boolean;
}

const UnsavedChangesBanner: React.FC<UnsavedChangesBannerProps> = (
  {onSaveChanges, hasUnsavedChanges, loading}) => {

  const {t} = useTranslation(['project']);

  return (
    <button
      onClick={onSaveChanges}
      className={`
          ${hasUnsavedChanges
          ? "bg-primary-600 hover:bg-primary-700"
          : "bg-zinc-400 dark:bg-dark-100 hover:bg-dark-200"}
          flex-grow-0 mt-4 px-6 py-2
          text-white justify-center rounded-md self-stretch
           disabled:bg-dark-100`}>
      {loading ? t('project:buttonSaving') : (
        hasUnsavedChanges ? t('project:button.saveChanges') : t('project:button.projectUpToDate')
      )}
    </button>
  )
};

export default UnsavedChangesBanner;
