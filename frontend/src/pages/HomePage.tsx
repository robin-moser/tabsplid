import {useNavigate} from 'react-router-dom';
import {LockOpen, Percent, Users} from "lucide-react";

import {Project} from "../types";
import {useProject} from "../hooks/useProject";

const HomePage = () => {

  const navigate = useNavigate();

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
    <div className="min-h-screen bg-gray-50 flex flex-col dark:bg-zinc-900">
      {/* Hero Section */}
      <section className="
        bg-primary-100 dark:bg-zinc-800 text-center overflow-hidden relative
        bg-[url('/hero15.jpg')] bg-cover bg-center bg-no-repeat">
        <div className="absolute inset-0 dark:bg-black bg-primary-900 opacity-70 dark:opacity-40 z-0"></div>
        <div className="max-w-6xl mx-auto z-10 relative p-6 sm:p-12 md:p-24">
          <h1 className="text-3xl md:text-4xl text-white font-bold mb-4">
            Simplify Group Expenses with Tabsplid
          </h1>
          <p className="text-lg text-white mb-12">
            Fair, fast, and frustration-free expense sharing for any group!
          </p>

          <div className="max-w-lg
            bg-neutral-50 dark:bg-zinc-800
            border-neutral-200 dark:border-zinc-700
            px-6 my-6 border rounded-lg shadow-lg
            text-neutral-800 dark:text-zinc-300
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
                  className="bg-primary-600 hover:bg-primary-700 flex-grow-0
                    mt-4 px-6 py-2 text-white justify-center rounded-md self-stretch">
                  Create Project
                </button>
              </form>

            </div>
          </div>

        </div>
      </section >

      {/* Explanation Section */}
      < section id="how-it-works" className="container mx-auto px-4 py-16 max-w-6xl" >
        <h2 className="text-3xl font-bold text-center mb-8">
          How tabsplid Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 px-6">
          <div className="text-center">
            <div className="bg-primary-100 dark:bg-zinc-700 rounded-full w-16 h-16 mx-auto mb-4">
              <LockOpen className="w-full h-full p-5" />
            </div>
            <h3 className="text-lg font-bold mb-2">No Account Needed</h3>
            <p className="">
              Share a link, and your group is ready to go.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-primary-100 dark:bg-zinc-700 rounded-full w-16 h-16 mx-auto mb-4">
              <Users className="w-full h-full p-5" />
            </div>
            <h3 className="text-lg font-bold mb-2">Track Every Expense</h3>
            <p className="">
              Add expenses and choose who pays and who shares.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-primary-100 dark:bg-zinc-700 rounded-full w-16 h-16 mx-auto mb-4">
              <Percent className="w-full h-full p-5" />
            </div>
            <h3 className="text-lg font-bold mb-2">Fair Settlement</h3>
            <p className="">
              Automatically calculate the most efficient way to settle up.
            </p>
          </div>
        </div>
      </section >

      {/* Footer Section */}
      < footer className="bg-gray-100 dark:bg-zinc-800 py-6" >
        <div className="container mx-auto text-center text-gray-600">
          <p>&copy; {new Date().getFullYear()} tabsplid. All rights reserved.</p>
        </div>
      </footer >
    </div >
  );
};

export default HomePage;
