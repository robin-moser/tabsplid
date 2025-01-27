import {useState} from "react";
import Cookies from 'js-cookie';
import {Toaster} from 'react-hot-toast';
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import ProjectPage from "./pages/ProjectPage";

const App = () => {

  const [showHeaderBorder, setShowHeaderBorder] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem("darkMode", String(newDarkMode));
  };

  return (
    <main className={` ${isDarkMode ? "dark" : ""} bg-neutral-100 dark:bg-dark-800 dark:text-neutral-200`}>
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
        <Footer />
        <Toaster
          position="bottom-right"
          reverseOrder={false}
          toastOptions={{
            duration: 4000,
            className: isDarkMode ? 'bg-dark-50 text-white' : 'bg-white text-gray-600',
          }}
        />
      </div >
    </main >
  );
};

export default App;
