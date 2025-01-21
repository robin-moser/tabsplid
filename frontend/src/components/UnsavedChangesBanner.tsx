interface UnsavedChangesBannerProps {
  onSaveChanges: () => void;
  hasUnsavedChanges: boolean;
  loading: boolean;
}

const UnsavedChangesBanner: React.FC<UnsavedChangesBannerProps> = (
  {onSaveChanges, hasUnsavedChanges, loading}) => {

  return (
    <button
      onClick={onSaveChanges}
      className={`
            ${hasUnsavedChanges
          ? "bg-primary-600 hover:bg-primary-700"
          : "bg-zinc-400 dark:bg-zinc-600 hover:bg-zinc-500"}
            flex-grow-0 mt-4 px-6 py-2
            text-white justify-center rounded-md self-stretch
             disabled:bg-zinc-400`}>
      {loading ? "Saving..." : (
        hasUnsavedChanges ? "Save Changes" : "Project up to date"
      )}
    </button>
  )
}

export default UnsavedChangesBanner;
