import {Sun, Moon} from "lucide-react";

const Header: React.FC<{
  toggleDarkMode: () => void;
  isDarkMode: boolean
  showHeaderBorder?: boolean;
}> = ({toggleDarkMode, isDarkMode, showHeaderBorder}) => {

  return (
    <header className={`
      ${showHeaderBorder ? "border-b-2" : ""}
      p-6 text-center border-neutral-200 dark:border-zinc-800
  `}>
      <div>
        <a href="/">
          <img src="/tabsplid.svg" className="w-52 mx-auto"></img>
        </a>
        <div className="w-52 mx-auto hidden">
        </div>
        <button onClick={toggleDarkMode}
          className="dark:bg-zinc-600 bg-zinc-300 p-2 rounded-lg absolute top-6 right-6">
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </header>
  );
}

export default Header;
