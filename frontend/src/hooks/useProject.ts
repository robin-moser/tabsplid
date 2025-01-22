import {useQuery, useMutation} from '@tanstack/react-query';
import toast from 'react-hot-toast';

import {getProject, addProject, updateProject, deleteProject} from '../api';
import {Project} from '../types';

// Fetch the project data by its ID
const fetchProject = async (projectId: string): Promise<Project> => {
    const response = await getProject(projectId);
    return response;
};

export const useProject = (projectId: string) => {

    // Query to fetch project data
    const getProjectQuery = useQuery({
        queryKey: ['project', projectId],
        queryFn: () => fetchProject(projectId),
        enabled: !!projectId,
        refetchOnWindowFocus: false,
        retry: false,
    });

    // Mutation to add a new project
    const addProjectMutation = useMutation({
        mutationFn: (project: Project) => addProject(project),
        onError: (error: any) => {
            toast.error('Error adding project: ' + error.message);
            console.error('Error adding project:', error);
        },
        onSuccess: (data) => {
            console.log('Successfully added project:', data);
        },
    });

    // Mutation for updating the project name
    const updateProjectMutation = useMutation({
        mutationFn: (project: Project) => updateProject(projectId, project),
        onError: (error: any) => {
            toast.error('Error updating project: ' + error.message);
            console.error('Error updating project:', error);
        },
        onSuccess: (data) => {
            // queryClient.invalidateQueries({queryKey: ['project', projectId]});
            toast.success('Project updated successfully');
            console.log('Successfully updated project:', data);
        },
    });

    // Mutation for deleting the project
    const deleteProjectMutation = useMutation({
        mutationFn: () => deleteProject(projectId),
        onError: (error: any) => {
            toast.error('Error deleting project: ' + error.message);
            console.error('Error deleting project:', error);
        },
        onSuccess: (data) => {
            toast.success('Project deleted successfully');
            console.log('Successfully deleted project:', data);
        }
    });


    return {

        getProject: getProjectQuery.data,
        addProject: addProjectMutation.mutate,
        deleteProject: deleteProjectMutation.mutate,
        updateProject: updateProjectMutation.mutate,
        addProjectAsync: addProjectMutation.mutateAsync,

        loading: {
            getProject: getProjectQuery.isPending,
            updateProject: updateProjectMutation.isPending,
        },

        error: {
            getProject: getProjectQuery.error,
            updateProject: updateProjectMutation.error,
        },
    };
};
