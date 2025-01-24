import {useState} from "react";
import Cookies from 'js-cookie';
import {Toaster} from 'react-hot-toast';
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";

import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import ProjectPage from "./pages/ProjectPage";

const App = () => {

  const [showHeaderBorder, setShowHeaderBorder] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return Cookies.get("darkMode") === "true";
  });

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    Cookies.set("darkMode", String(newDarkMode), {expires: 365});
  };

  return (
    <main className={` ${isDarkMode ? "dark" : ""} bg-neutral-100 dark:bg-zinc-900 dark:text-white`}>
      <div className="w-full min-h-screen flex flex-col">

        < Header
          toggleDarkMode={toggleDarkMode}
          isDarkMode={isDarkMode}
          showHeaderBorder={showHeaderBorder} />
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/project/:projectId"
              element={<ProjectPage setShowHeaderBorder={setShowHeaderBorder} />}
            />
            <Route path="/demo"
              element={<ProjectPage setShowHeaderBorder={setShowHeaderBorder} isDemo={true} />}
            />
          </Routes>
        </Router>

        <Toaster
          position="bottom-right"
          reverseOrder={false}
          toastOptions={{
            duration: 4000,
            style: {
              background: isDarkMode ? '#333' : '#fff',
              color: isDarkMode ? '#fff' : '#333',
            },
          }}
        />
      </div >
    </main >
  );
};

export default App;
