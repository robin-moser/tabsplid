import {useQuery} from "@tanstack/react-query";
import {useSearchParams} from "react-router-dom";

import {getProjects} from "../api";
import {Project} from "../types";
import {ArrowRightIcon, TriangleAlert} from "lucide-react";

const HomePage = () => {

  const {data: projects, isLoading, error} = useQuery<Project[]>({queryKey: ['projects'], queryFn: getProjects});

  const [searchParams] = useSearchParams();
  const showall = searchParams.get("showall")

  if (isLoading) {
    return <div>Loading projects...</div>;
  }

  // Handle error state
  if (error instanceof Error) {
    return <div>Error loading projects: {error.message}</div>;
  }

  // If there are no projects
  if (!projects || projects.length === 0) {
    return <div>No projects found.</div>;
  }

  console.log(showall)
  return (
    <div className="w-full max-w-6xl mx-auto mt-8">
      {(showall === "true") ?
        (
          <>
            <h1 className="text-4xl font-bold mb-4">Projects</h1>
            <ul className="space-y-2 text-xl">
              {projects.map((project) => (
                <li key={project.id}>
                  <a href={`/project/${project.id}`}>
                    <ArrowRightIcon className="inline-block w-4 h-4 mr-2" />
                    {project.name}
                  </a>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <>
            <TriangleAlert className="w-16 h-16 m-6 text-red-500 mx-auto" />
            <h2 className="text-4xl text-center font-bold flex justify-center items-start">
              Coming Soon<span className="text-2xl ba">™️ </span>
            </h2>
          </>
        )
      }
    </div >
  );
};

export default HomePage;
