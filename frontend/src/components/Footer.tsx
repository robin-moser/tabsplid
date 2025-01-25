const Footer: React.FC = () => {

  return (
    <footer className="flex items-center justify-between px-4 bg-gray-100 dark:bg-zinc-800 py-6">
      <div className="flex-1"></div>
      <div className="container mx-auto text-center text-gray-600">
        <p>&copy; {new Date().getFullYear()} tabsplid. All rights reserved.</p>
      </div>
      <div className="text-right flex-1 text-gray-400">
        <span>Version {import.meta.env.VITE_APP_VERSION}</span>
      </div>
    </footer >


  );
}

export default Footer;
