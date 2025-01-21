import {useQuery, useMutation} from '@tanstack/react-query';
import toast from 'react-hot-toast';

import {getProject, updateProject, } from '../api';
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
        refetchOnWindowFocus: false
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


    return {

        getProject: getProjectQuery.data,
        updateProject: updateProjectMutation.mutate,

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
