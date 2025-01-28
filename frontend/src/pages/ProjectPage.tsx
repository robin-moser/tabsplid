import {useEffect} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {useProject} from "../hooks/useProject";

import {useProjectState} from "../hooks/useProjectState";
import {useMemberActions} from "../hooks/useMemberActions";

import {calculatePayments} from "../utils/calculatePayments";

import UnsavedChangesBanner from '../components/UnsavedChangesBanner';
import MemberList from "../components/MemberList";
import PaymentList from "../components/PaymentList";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";

import {formatDate} from "../utils";
import {Member, Expense} from "../types";
import {Trash2} from "lucide-react";
import {Tooltip} from "react-tooltip";
import toast from "react-hot-toast";
import {useTranslation} from "react-i18next";

const ProjectPage: React.FC<{
  setShowHeaderBorder: (show: boolean) => void;
  isDemo?: boolean;
}> = ({setShowHeaderBorder, isDemo}) => {

  const {t} = useTranslation(['project', 'common']);

  const {projectId: routeProjectId} = useParams<{projectId: string}>();
  const projectId = isDemo ? import.meta.env.VITE_DEMO_PROJECT_ID : routeProjectId;

  const navigate = useNavigate();

  const {
    getProject: project,
    updateProject,
    deleteProject,
    loading,
    error
  } = useProject(projectId || '');

  const {
    updateMember,
    deleteMember,
    updateExpense,
    deleteExpense,
    addMemberAsync,
    addExpenseAsync
  } = useMemberActions(projectId || '');

  const {
    updatedProjectPayments,
    setUpdatedProjectPayments,
    setOriginalProjectName,
    editedProjectName,
    setEditedProjectName,
    originalMembers,
    setOriginalMembers,
    updatedMembers,
    setUpdatedMembers,
    isConfirmModalOpen,
    setIsConfirmModalOpen,
    detectChanges
  } = useProjectState(project);

  useEffect(() => {
    setShowHeaderBorder(true);
  }, [setShowHeaderBorder]);

  useEffect(() => {
    setUpdatedProjectPayments(calculatePayments(updatedMembers));
  }, [updatedMembers, setUpdatedProjectPayments]);

  const {projectNameChanged, membersChanged} = detectChanges();
  const hasUnsavedChanges = projectNameChanged || membersChanged;

  // Save changes only if needed
  const handleSaveChanges = async () => {
    if (!project) return;
    if (!hasUnsavedChanges) return;

    // Prevent saving in demo mode
    if (isDemo) {
      toast.error(t('project:demoModeChangesNotSaved'), {
        className: '!bg-slate-900 dark:!bg-slate-700 !text-white !py-6 !px-8',
        position: 'top-right',
        duration: 5000,
      });
      setOriginalProjectName(editedProjectName);
      setOriginalMembers([...updatedMembers]);
      return;
    }

    if (projectNameChanged) {
      updateProject({...project, name: editedProjectName});
    }

    if (membersChanged) {

      // wait for the new members to be added
      const newUpdatedMembers: Member[] = await Promise.all(
        updatedMembers.map(async (member) => {
          if (!originalMembers.some(m => m.id === member.id)) {
            const newMember = await addMemberAsync(member);
            return {...member, id: newMember.data.id};
          }
          return member;
        })
      );
      setUpdatedMembers(newUpdatedMembers);

      // Update member names
      newUpdatedMembers.forEach(member => {
        const original = originalMembers.find(m => m.id === member.id);
        // if the member name or order has changed, update it
        if (original && (
          member.name !== original.name ||
          member.order !== original.order)
        ) {
          updateMember(member);
        }
      });

      // Delete members
      originalMembers.forEach(async (member) => {
        // if member id is not in updated members, delete it
        if (!newUpdatedMembers.some(m => m.id === member.id)) {
          deleteMember(member);
        }
      });

      // Update member expenses
      newUpdatedMembers.forEach(async (member) => {
        member.expenses.forEach(async (expense) => {

          // Find the corresponding original expense by ID
          const originalExpense = originalMembers
            .find(m => m.id === member.id)
            ?.expenses.find(origExpense => origExpense.id === expense.id);

          if (!originalExpense) {
            // Expense is new, create it
            const newExpense = await addExpenseAsync({memberId: member.id, expense});
            expense = newExpense.data;

          } else if (
            // Expense has changed, update it
            expense.amount !== originalExpense.amount ||
            expense.name !== originalExpense.name ||
            expense.order !== originalExpense.order ||
            JSON.stringify(expense.involved_members.map(m => m.id)) !==
            JSON.stringify(originalExpense.involved_members.map(m => m.id))
          ) {
            updateExpense({memberId: member.id, expense});
          }
        });

        // Delete expenses
        originalMembers.find(m => m.id === member.id)?.expenses.forEach(async (expense) => {
          // if expense id is not in updated expenses, delete it
          if (!member.expenses.some(exp => exp.id === expense.id)) {
            deleteExpense({memberId: member.id, expense: expense});
          }
        });
      });

    }

    // Reset the original state to reflect the saved changes
    setOriginalProjectName(editedProjectName);
    setOriginalMembers([...updatedMembers]);
  };

  const handleMemberAdd = (newMember: Member) => {
    setUpdatedMembers(prev => [...prev, newMember]);
  }

  const handleMemberUpdate = (updatedMember: Member) => {
    setUpdatedMembers(prev =>
      prev.map((member, index) => {
        const newMember = member.id === updatedMember.id ? updatedMember : member;
        return {...newMember, order: index};
      })
    );
  };

  const handleMemberDelete = (updatedMember: Member) => {
    setUpdatedMembers(prev => prev.filter(member => member.id !== updatedMember.id));
  }

  const handleExpenseUpdate = (memberId: string, updatedExpense: Expense) => {
    setUpdatedMembers(prev => {
      const updated = prev.map(member =>
        member.id === memberId
          ? {
            ...member,
            expenses: member.expenses.map((expense, index) => {
              const newExpense = expense.id === updatedExpense.id ? updatedExpense : expense;
              return {...newExpense, order: index};
            })
          } : member
      )
      if (JSON.stringify(prev) === JSON.stringify(updated)) {
        return prev;
      }
      return updated;
    });
  };

  const handleExpenseDelete = (memberId: string, expense: Expense) => {
    setUpdatedMembers(prev =>
      prev.map(member =>
        member.id === memberId
          ? {
            ...member,
            expenses: member.expenses.filter(exp => exp.id !== expense.id),
          } : member
      )
    );
  }

  const handleConfirm = () => {
    setIsConfirmModalOpen(false);
    deleteProject();
    navigate('/');
  };

  const handleClose = () => {
    setIsConfirmModalOpen(false);
  };

  const handleProjectDelete = async () => {
    setIsConfirmModalOpen(true);
  }

  if (loading.getProject) return <LoadingSpinner />;
  if (error.getProject) return <ErrorMessage error={t('project:projectLoadError', {message: error.getProject?.message})} />;
  if (!project) return <ErrorMessage error={t('project:projectNotFound')} />;

  return (
    <div className="mb-6">
      <div className={`
      w-full left-0 transition-all duration-300 ease-in-out text-sm text-center
      p-1 min-h-8 sticky top-0 z-40 text-white md:hidden ${hasUnsavedChanges
          ? "opacity-100 bg-primary-600 cursor-pointer hover:bg-primary-700"
          : "opacity-0 bg-zinc-400"}`}
        onClick={hasUnsavedChanges ? handleSaveChanges : undefined}>
        {t('project:unsavedChangesNotice')}
      </div>
      <div className="
      w-full max-w-6xl mx-auto mt-8
      flex md:flex-row flex-col items-start
      text-neutral-800 dark:text-neutral-300">

        {/* Left panel: Member List */}
        <div className="
        px-4 border-neutral-200 dark:border-dark-400
        max-w-lg w-full mx-auto md:mx-0 md:border-r-2 md:pr-6">
          <div className="py-4 text-3xl font-bold flex flex-row gap-2">
            <input
              type="text"
              placeholder={t('project:projectNamePlaceholder')}
              value={editedProjectName}
              onChange={(e) => setEditedProjectName(e.target.value)}
              className="
              w-full px-2 py-2 border rounded-md input-ring
              border-neutral-200 dark:border-dark-100
              bg-white dark:bg-dark-400"
            />
          </div>
          <div className="flex flex-row justify-left gap-2 items-center">
            <span className="text-sm relative -top-2 text-zinc-400">
              {t('project:createdDate', {date: formatDate(project.created_at)})}
            </span>
            <Tooltip id="delete" />
            <ConfirmDeleteModal
              isOpen={isConfirmModalOpen}
              onClose={handleClose}
              onConfirm={handleConfirm}
              message={t('project:confirmDeleteProject')}
            />
            <Trash2 className="relative -top-2 w-4 text-zinc-400 cursor-pointer"
              onClick={handleProjectDelete}
              data-tooltip-content={t('project:deleteProjectTooltip')}
              data-tooltip-id="delete"
              data-tooltip-place="right"
            />
          </div>
          <MemberList
            members={updatedMembers}
            onAddMember={handleMemberAdd}
            onUpdateMember={handleMemberUpdate}
            onDeleteMember={handleMemberDelete}
            onUpdateExpense={handleExpenseUpdate}
            onDeleteExpense={handleExpenseDelete}
          />
        </div>

        {/* Right Panel */}
        <div className="
        w-full flex flex-col items-center mx-auto md:pl-6 px-4
        justify-center self-start sticky top-0 max-w-md">
          <UnsavedChangesBanner
            onSaveChanges={handleSaveChanges}
            hasUnsavedChanges={hasUnsavedChanges}
            loading={loading.updateProject}
          />
          <PaymentList payments={updatedProjectPayments} />
        </div>
      </div>
    </div>
  );
};

export default ProjectPage;
