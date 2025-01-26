import {useQuery, useMutation} from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {AxiosError} from 'axios';
import i18n from "../i18n";

import {Project} from '../types';
import {
  getProject,
  addProject,
  updateProject,
  deleteProject,
  getErrorMessage,
} from '../api';

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
    retry: (failureCount, error: AxiosError) => {
      if (error.response?.status === 404) return false;
      if (error.response?.status === 429) return false;
      return failureCount < 3;
    }
  });

  // Mutation to add a new project
  const addProjectMutation = useMutation({
    mutationFn: (project: Project) => addProject(project),
    onError: (error: AxiosError) => {
      const message = getErrorMessage(error);
      console.error('Error adding project:', error);
      toast.error(i18n.t('common:error.addingProject') + message);
    },
    onSuccess: (data) => {
      console.log('Successfully added project:', data);
    },
  });

  // Mutation for updating the project name
  const updateProjectMutation = useMutation({
    mutationFn: (project: Project) => updateProject(projectId, project),
    onError: (error: AxiosError) => {
      const message = getErrorMessage(error);
      console.error('Error updating project:', error);
      toast.error(i18n.t('common:error.updatingProject') + message);
    },
    onSuccess: (data) => {
      // queryClient.invalidateQueries({queryKey: ['project', projectId]});
      console.log('Successfully updated project:', data);
      toast.success(i18n.t('common:success.projectUpdatedSuccessfully'));
    },
  });

  // Mutation for deleting the project
  const deleteProjectMutation = useMutation({
    mutationFn: () => deleteProject(projectId),
    onError: (error: AxiosError) => {
      const message = getErrorMessage(error);
      console.error('Error deleting project:', error);
      toast.error(i18n.t('common:error.deletingProject') + message);
    },
    onSuccess: (data) => {
      console.log('Successfully deleted project:', data);
      toast.success(i18n.t('common:success.projectDeletedSuccessfully'));
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
      getProject: getProjectQuery.error
        ? {...getProjectQuery.error, message: getErrorMessage(getProjectQuery.error)}
        : undefined,

      updateProject: updateProjectMutation.error
        ? {...updateProjectMutation.error, message: getErrorMessage(updateProjectMutation.error)}
        : undefined,
    }
  };
};
