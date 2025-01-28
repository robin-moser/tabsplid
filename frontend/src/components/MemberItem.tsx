import {useEffect, useState} from "react";
import {User, CirclePlus, CircleX} from "lucide-react";
import {Tooltip} from 'react-tooltip'

import ExpenseItem from "./ExpenseItem";
import {Expense, Member} from "../types";
import {useTranslation} from "react-i18next";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

interface MemberItemProps {
  member: Member;
  onUpdateMember: (member: Member) => void;
  onDeleteMember: (member: Member) => void;
  onUpdateExpense: (memberId: string, expense: Expense) => void;
  onDeleteExpense: (memberId: string, expense: Expense) => void;
  allMembers: Member[];
}

const MemberItem: React.FC<MemberItemProps> = (
  {member, onUpdateMember, onDeleteMember, onUpdateExpense, onDeleteExpense, allMembers}) => {
  const [editedMemberName, setEditedMemberName] = useState<string | null>(member.name);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const {t} = useTranslation(['project']);

  const handleRemoveMember = () => {
    setIsConfirmModalOpen(true);
  };

  const handleConfirm = () => {
    onDeleteMember(member);
    setIsConfirmModalOpen(false);
  };

  const handleClose = () => {
    setIsConfirmModalOpen(false);
  };


  useEffect(() => {
    onUpdateMember({...member, name: editedMemberName});
  }, [editedMemberName]);

  const addNewExpense = () => {
    const newExpense = {
      id: "new-" + Math.random().toString(36).substring(2, 6),
      order: member.expenses.length,
      name: null,
      amount: null,
      involved_members: [],
    };
    const updatedMember = {
      ...member, expenses: [...member.expenses, newExpense],
    };
    onUpdateMember(updatedMember);
  };


  return (
    <div className="
        bg-neutral-50 dark:bg-dark-600
        shadow-neutral-200 dark:shadow-dark-950
        border-neutral-200 dark:border-dark-400
        p-4 my-6 border rounded-lg shadow-lg">
      <div className="flex flex-row items-center justify-between
        border-b-2 dark:border-dark-50 pb-4 mb-4">
        <div className="flex items-center gap-2">
          <div className="flex items-left dark:shadow-lg dark:shadow-dark-700">
            <span className="px-3 py-3 rounded-l-md border border-r-0 member-input !shadow-none">
              <User size={22} />
            </span>
            <input
              className="max-w-md px-2 border rounded-r-md rounded-l-none member-input !shadow-none w-full"
              type="text"
              placeholder={t('project:placeholder.memberName')}
              value={editedMemberName || ""}
              onChange={(e) => setEditedMemberName(e.target.value)}
            />
          </div>
          <Tooltip id="remove" />
          <ConfirmDeleteModal
            isOpen={isConfirmModalOpen}
            onClose={handleClose}
            onConfirm={handleConfirm}
            message={t('project:confirmDeleteMember')}
          />
          <CircleX
            className="cursor-pointer text-zinc-400 flex-shrink-0 cst-icon-button"
            onClick={handleRemoveMember}
            data-tooltip-content={t('project:tooltip.removeThisMember')}
            data-tooltip-id="remove"
          />
        </div>
        <div className="bg-primary-200 dark:bg-primary-500 dark:bg-opacity-80 ml-2 px-2 rounded-md">
          <span className="flex flex-shrink-0 text-nowrap gap-2 items-center">
            {parseFloat(member.expenses.reduce((acc, expense) => acc + (expense.amount || 0), 0).toFixed(10))}
          </span>
        </div>
      </div>
      <div className="w-full">
        {member.expenses.map((expense, index) => (
          <ExpenseItem
            key={index}
            memberId={member.id}
            expense={expense}
            onUpdateExpense={onUpdateExpense}
            onDeleteExpense={onDeleteExpense}
            allMembers={allMembers}
          />
        ))}
        <div className="relative z-20">
          <button className="
          flex items-center justify-center gap-2 border w-3/4
          hover:bg-zinc-300 dark:hover:bg-dark-400
          px-4 py-2 rounded-md member-input"
            onClick={addNewExpense}
          >
            <CirclePlus size={18} />
            {t('project:button.addExpense')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MemberItem;
