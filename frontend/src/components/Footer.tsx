const Footer: React.FC = () => {

  return (
    <footer className="flex items-center justify-between px-4 py-6 mt-auto
      bg-neutral-200 dark:bg-zinc-800 text-gray-500 dark:text-neutral-500">
      <div className="flex-1"></div>
      <div className="container mx-auto text-center">
        <p>&copy; {new Date().getFullYear()} tabsplid. All rights reserved.</p>
      </div>
      <div className="text-right flex-1 text-gray-400 dark:text-neutral-600">
        <span>Version {import.meta.env.VITE_APP_VERSION}</span>
      </div>
    </footer >


  );
}

export default Footer;
