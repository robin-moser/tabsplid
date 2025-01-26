import {useEffect, useState} from "react";
import {User, Coins, CirclePlus, CircleX} from "lucide-react";
import {Tooltip} from 'react-tooltip'

import ExpenseItem from "./ExpenseItem";
import {Expense, Member} from "../types";

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

  useEffect(() => {
    onUpdateMember({...member, name: editedMemberName});
  }, [editedMemberName]);

  const handleRemoveMember = () => {
    onDeleteMember(member);
  }

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
          <div className="flex items-left">
            <span className="px-3 py-3 rounded-l-md border-r-0 member-input">
              <User size={22} />
            </span>
            <input
              className="max-w-md px-2 border rounded-r-md rounded-l-none member-input w-full"
              type="text"
              placeholder="Name"
              value={editedMemberName || ""}
              onChange={(e) => setEditedMemberName(e.target.value)}
            />
          </div>
          <Tooltip id="remove" />
          <CircleX
            size={20}
            className="cursor-pointer text-zinc-400"
            onClick={handleRemoveMember}
            data-tooltip-content="Remove this member"
            data-tooltip-id="remove"
          />
        </div>
        <div className="">
          <span className="ml-2 text-neutral-500 dark:text-gray-400 flex gap-2 items-center">
            <Coins size={18} />
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
        <button className="
          flex items-center justify-center gap-2 border w-3/4
          hover:bg-zinc-300 dark:hover:bg-dark-400
          px-4 py-2 rounded-md member-input"
          onClick={addNewExpense}
        >
          <CirclePlus size={18} />
          Add Expense
        </button>
      </div>
    </div >

  );
};

export default MemberItem;
