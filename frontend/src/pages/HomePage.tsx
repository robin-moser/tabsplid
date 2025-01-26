import {useNavigate} from 'react-router-dom';
import {LockOpen, Percent, Users} from "lucide-react";

import {Project} from "../types";
import {useProject} from "../hooks/useProject";

const HomePage = () => {

  const navigate = useNavigate();
  document.title = 'tabsplid - Simplify Group Expenses';

  const {
    addProjectAsync,
  } = useProject('');

  const handleProjectAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const projectName = formData.get('projectName') as string;

    try {
      const createdProject = await addProjectAsync({name: projectName} as Project);
      navigate(`/project/${createdProject.data.id}`);
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="
        bg-primary-100 dark:bg-dark-700 text-center overflow-hidden relative
        bg-[url('/hero.jpg')] bg-cover bg-center bg-no-repeat">
        <div className="absolute inset-0 dark:bg-black bg-primary-900 opacity-70 dark:opacity-40 z-0"></div>
        <div className="max-w-6xl mx-auto z-10 relative p-6 sm:p-12 md:p-24">
          <h1 className="text-3xl md:text-4xl text-white font-bold mb-4">
            Simplify group expenses with tabsplid
          </h1>
          <p className="text-lg text-white mb-12">
            Fair, fast, and frustration-free expense sharing for any group!
          </p>

          <div className="max-w-lg
            bg-neutral-50 dark:bg-dark-700
            border-neutral-200 dark:border-dark-400
            px-6 my-6 border rounded-lg shadow-lg
            text-neutral-800 dark:text-neutral-100
            w-full mx-auto overflow-hidden relative">

            <div className="flex flex-col items-center relative py-8">
              <h2 className="text-3xl font-bold mb-4">Start a new project</h2>
              <form className="max-w-md mx-auto" onSubmit={handleProjectAdd}>
                <input
                  type="text"
                  name="projectName"
                  placeholder="Enter your project name..."
                  className="w-full px-4 py-3 border rounded-lg shadow-sm mb-4
                    focus:outline-none focus:ring-2 focus:ring-primary-600 member-input" />
                <button
                  type="submit"
                  className="w-4/5 md:w-2/5 md:mx-2 bg-primary-600 hover:bg-primary-700
                    mt-4 px-6 py-2 text-white justify-center rounded-md self-stretch">
                  Create Project
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/demo')}
                  className="w-4/5 md:w-2/5 md:mx-2 bg-zinc-300 hover:bg-zinc-200 dark:hover:bg-dark-400
                  dark:bg-dark-400 text-dark-700 dark:text-neutral-200 border-0 font-bold
                    mt-4 px-6 py-2 justify-center rounded-md self-stretch">
                  Show Example
                </button>
              </form>
              <div className="max-w-md mx-auto w-full">
              </div>

            </div>
          </div>

        </div>
      </section >

      {/* Explanation Section */}
      < section id="how-it-works" className="container mx-auto px-4 py-16 max-w-6xl" >
        <h2 className="text-3xl font-bold text-center mb-8">
          How tabsplid works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 px-6">
          <div className="text-center">
            <div className="bg-primary-100 dark:bg-dark-400 rounded-full w-16 h-16 mx-auto mb-4">
              <LockOpen className="w-full h-full p-5" />
            </div>
            <h3 className="text-lg font-bold mb-2">No Account Needed</h3>
            <p className="">
              Share a link, and your group is ready to go.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-primary-100 dark:bg-dark-400 rounded-full w-16 h-16 mx-auto mb-4">
              <Users className="w-full h-full p-5" />
            </div>
            <h3 className="text-lg font-bold mb-2">Track Every Expense</h3>
            <p className="">
              Add expenses and choose who pays and who shares.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-primary-100 dark:bg-dark-400 rounded-full w-16 h-16 mx-auto mb-4">
              <Percent className="w-full h-full p-5" />
            </div>
            <h3 className="text-lg font-bold mb-2">Fair Settlement</h3>
            <p className="">
              Automatically calculate the most efficient way to settle up.
            </p>
          </div>
        </div>
      </section >
    </div >
  );
};

export default HomePage;
