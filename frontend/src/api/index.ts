import axios, {AxiosError} from "axios";
import {Project, Member, Expense} from "../types";
import i18n from "../i18n";

const API_URL = import.meta.env.VITE_API_URL;

// Print different error messages based on the error code
export const getErrorMessage = (error: AxiosError) => {
  switch (error.code) {
    case 'ERR_NETWORK':
      return i18n.t('common:error.networkError');
    case 'ECONNABORTED':
      return i18n.t('common:error.requesetAborted');
    case 'ETIMEDOUT':
      return i18n.t('common:error.requestTimeout');
  }

  switch (error.status) {
    case 429:
      return i18n.t('common:error.tooManyRequests');
    default:
      return error.message;
  }
};

export const getProjects = async (): Promise<Project[]> => {
  const response = await axios.get(`${API_URL}/projects`);
  console.log(response)
  return response.data.map((project: Project) => ({
    ...project,
    created_at: new Date(`${project.created_at}Z`),
    updated_at: new Date(`${project.updated_at}Z`),
  }));
}

export const getProject = async (projectId: string): Promise<Project> => {
  const response = await axios.get(`${API_URL}/projects/${projectId}`);
  return {
    ...response.data,
    created_at: new Date(`${response.data.created_at}Z`),
    updated_at: new Date(`${response.data.updated_at}Z`),
  };
};

export const addProject = async (project: Project) => {
  if (project.name === "") project.name = null;
  return axios.post(`${API_URL}/projects`, project);
}

export const updateProject = async (projectId: string, project: Project) => {
  if (project.name === "") project.name = null;
  return axios.put(`${API_URL}/projects/${projectId}`, project);
}

export const deleteProject = async (projectId: string) => {
  return axios.delete(`${API_URL}/projects/${projectId}`);
}

export const addMember = async (projectId: string, member: Member) => {
  return axios.post(`${API_URL}/projects/${projectId}/members`, member);
};

export const updateMember = async (projectId: string, member: Member) => {
  if (member.name === "") member.name = null;
  return axios.put(`${API_URL}/projects/${projectId}/members/${member.id}`, member);
};

export const deleteMember = async (projectId: string, memberId: string) => {
  return axios.delete(`${API_URL}/projects/${projectId}/members/${memberId}`);
}

export const addExpense = async (projectId: string, memberId: string, expense: Expense) => {
  // extract only the ids from involved_members instead of the whole object
  const data = {...expense, involved_members: expense.involved_members.map((member) => member.id)};
  return axios.post(`${API_URL}/projects/${projectId}/members/${memberId}/expenses`, data);
};

export const updateExpense = async (projectId: string, memberId: string, expense: Expense) => {
  // extract only the ids from involved_members instead of the whole object
  const data = {...expense, involved_members: expense.involved_members.map((member) => member.id)};
  return axios.put(`${API_URL}/projects/${projectId}/members/${memberId}/expenses/${expense.id}`, data);
};

export const deleteExpense = async (projectId: string, memberId: string, expenseId: string) => {
  return axios.delete(`${API_URL}/projects/${projectId}/members/${memberId}/expenses/${expenseId}`);
};
