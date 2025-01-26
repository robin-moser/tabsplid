import {TriangleAlert} from "lucide-react";

interface ErrorMessageProps {
  error: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({error}) => {
  return (
    <div className="
        max-w-6xl mx-auto mt-8
        text-neutral-800 dark:text-gray-300">
      <TriangleAlert className="w-16 h-16 m-6 text-red-500 mx-auto" />
      <h2 className="text-xl">{error}</h2>
    </div>
  )
}

export default ErrorMessage;
