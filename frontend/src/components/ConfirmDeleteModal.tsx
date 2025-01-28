import {useTranslation} from "react-i18next";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message?: string;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = (
  {isOpen, onClose, onConfirm, message}) => {

  const {t} = useTranslation(['project']);

  if (!isOpen) return null;


  return (
    <div className="
      fixed inset-0 flex items-center justify-center
      bg-black bg-opacity-50 z-50 dark:bg-opacity-60">
      <div
        className="fixed inset-0 -z-10"
        onClick={onClose}
      />
      <div className="
        bg-white rounded-lg max-w-md m-4 shadow-lg p-6 px-8
        dark:bg-dark-600 dark:border-dark-200 dark:border-2">
        <h2 className="text-xl font-semibold mb-4 py-4">
          {message}
        </h2>
        <div className="flex justify-end mt-4 gap-2">
          <button
            className="px-4 py-2 bg-zinc-300 dark:bg-dark-100 rounded-md"
            onClick={onClose}
          >
            {t('common:button.cancel')}
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            onClick={onConfirm}
          >
            {t('common:button.confirm')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
