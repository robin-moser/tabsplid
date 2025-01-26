import {useMutation, useQueryClient} from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {AxiosError} from 'axios';

import {t} from 'i18next';

import {Member, Expense} from '../types';
import {
  addMember,
  updateMember,
  deleteMember,
  addExpense,
  updateExpense,
  deleteExpense,
  getErrorMessage,
} from '../api';

export const useMemberActions = (projectId: string) => {
  const queryClient = useQueryClient();

  // Mutation to add a new member
  const addMemberMutation = useMutation({
    mutationFn: (newMember: Member) => addMember(projectId, newMember),
    onError: (error: AxiosError) => {
      const message = getErrorMessage(error);
      toast.error(t('common:error.addingMember') + ': ' + message);
      console.error('Error adding member:', error);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({queryKey: ['project', projectId]});
      toast.success(t('common:success.memberAddedSuccessfully', {name: data.data.name}));
      console.log('Successfully added member:', data);
    },
  });

  // Mutation for updating a member
  const updateMemberMutation = useMutation({
    mutationFn: (member: Member) => updateMember(projectId, member),
    onError: (error: AxiosError) => {
      const message = getErrorMessage(error);
      toast.error(t('common:error.updatingMember') + ': ' + message);
      console.error('Error updating member:', error);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({queryKey: ['project', projectId]});
      toast.success(t('common:success.memberUpdatedSuccessfully', {name: data.data.name}));
      console.log('Successfully updated member', data);
    },
  });

  // Mutation to delete a member
  const deleteMemberMutation = useMutation({
    mutationFn: (member: Member) => deleteMember(projectId, member.id),
    onError: (error: AxiosError) => {
      const message = getErrorMessage(error);
      toast.error(t('common:error.deletingMember') + ': ' + message);
      console.error('Error deleting member:', error);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({queryKey: ['project', projectId]});
      toast.success(t('common:success.memberDeletedSuccessfully', {name: variables.name}));
      console.log('Successfully deleted member', variables);
    },
  });

  // Mutation to add a new expense
  const addExpenseMutation = useMutation({
    mutationFn: ({memberId, expense}: {memberId: string, expense: Expense}) =>
      addExpense(projectId, memberId, expense),
    onError: (error: AxiosError) => {
      const message = getErrorMessage(error);
      toast.error(t('common:error.addingExpense') + ': ' + message);
      console.error('Error adding expense:', error);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({queryKey: ['project', projectId]});
      toast.success(t('common:success.expenseAddedSuccessfully', {name: data.data.name}));
      console.log('Successfully added expense:', data);
    },
  });

  // Mutation for updating an expense
  const updateExpenseMutation = useMutation({
    mutationFn: ({memberId, expense}: {memberId: string, expense: Expense}) =>
      updateExpense(projectId, memberId, expense),
    onError: (error: AxiosError) => {
      const message = getErrorMessage(error);
      toast.error(t('common:error.updatingExpense') + ': ' + message);
      console.error('Error updating expense:', error);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({queryKey: ['project', projectId]});
      toast.success(t('common:success.expenseUpdatedSuccessfully', {name: data.data.name}));
      console.log('Successfully updated expense', data);
    },
  });

  const deleteExpenseMutation = useMutation({
    mutationFn: ({memberId, expense}: {memberId: string, expense: Expense}) =>
      deleteExpense(projectId, memberId, expense.id),
    onError: (error: AxiosError) => {
      const message = getErrorMessage(error);
      toast.error(t('common:error.deletingExpense') + ': ' + message);
      console.error('Error deleting expense:', error);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({queryKey: ['project', projectId]});
      toast.success(t('common:success.expenseDeletedSuccessfully', {name: variables.expense.name}));
      console.log('Successfully deleted expense', variables);
    },
  });

  return {
    addMember: addMemberMutation.mutate,
    updateMember: updateMemberMutation.mutate,
    deleteMember: deleteMemberMutation.mutate,

    addExpense: addExpenseMutation.mutate,
    updateExpense: updateExpenseMutation.mutate,
    deleteExpense: deleteExpenseMutation.mutate,

    addMemberAsync: addMemberMutation.mutateAsync,
    addExpenseAsync: addExpenseMutation.mutateAsync,

    // Loading and error states
    loading: {
      addMember: addMemberMutation.isPending,
      updateMember: updateMemberMutation.isPending,
      deleteMember: deleteMemberMutation.isPending,
      addExpense: addExpenseMutation.isPending,
      updateExpense: updateExpenseMutation.isPending,
      deleteExpense: deleteExpenseMutation.isPending,
    },
    error: {
      addMember: addMemberMutation.error
        ? {...addMemberMutation.error, message: getErrorMessage(addMemberMutation.error)}
        : undefined,

      updateMember: updateMemberMutation.error
        ? {...updateMemberMutation.error, message: getErrorMessage(updateMemberMutation.error)}
        : undefined,

      deleteMember: deleteMemberMutation.error
        ? {...deleteMemberMutation.error, message: getErrorMessage(deleteMemberMutation.error)}
        : undefined,

      addExpense: addExpenseMutation.error
        ? {...addExpenseMutation.error, message: getErrorMessage(addExpenseMutation.error)}
        : undefined,

      updateExpense: updateExpenseMutation.error
        ? {...updateExpenseMutation.error, message: getErrorMessage(updateExpenseMutation.error)}
        : undefined,

      deleteExpense: deleteExpenseMutation.error
        ? {...deleteExpenseMutation.error, message: getErrorMessage(deleteExpenseMutation.error)}
        : undefined,
    },
  };
};
