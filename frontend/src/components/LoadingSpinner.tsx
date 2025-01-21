const LoadingSpinner = () => {
  return (
    <div key="spinner" className="flex flex-1 items-center justify-center">
      <div className="inline-block h-14 w-14 animate-spin rounded-full border-8 border-current border-e-transparent">
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  )
}

export default LoadingSpinner
