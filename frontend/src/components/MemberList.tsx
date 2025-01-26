import {CirclePlus} from 'lucide-react';
import {Expense, Member} from '../types';
import MemberItem from './MemberItem';

interface MemberListProps {
  members: Member[];
  onAddMember: (member: Member) => void;
  onUpdateMember: (member: Member) => void;
  onDeleteMember: (member: Member) => void;
  onUpdateExpense: (memberId: string, expense: Expense) => void;
  onDeleteExpense: (memberId: string, expense: Expense) => void;
}

const MemberList: React.FC<MemberListProps> = (
  {members, onAddMember, onUpdateMember, onDeleteMember, onUpdateExpense, onDeleteExpense}) => {

  const addNewMember = () => {
    onAddMember({
      id: "new-" + Math.random().toString(36).substring(2, 6),
      order: members.length,
      name: '',
      expenses: [],
      balance: 0,
    } as Member);
  }

  return (
    <div>
      {members.map((member) => (
        <MemberItem
          key={member.id}
          member={member}
          onUpdateMember={onUpdateMember}
          onDeleteMember={onDeleteMember}
          onUpdateExpense={onUpdateExpense}
          onDeleteExpense={onDeleteExpense}
          allMembers={members}
        />
      ))}
      <button className="
        flex items-center justify-center gap-2 w-full
        p-4 py-2 my-6 rounded-md bg-white dark:bg-dark-400
        border-neutral-200 dark:border-dark-100
        hover:bg-neutral-200 dark:hover:bg-dark-200
        border"
        onClick={addNewMember}
      >
        <CirclePlus size={18} />
        Add Member
      </button>
    </div>
  );
};

export default MemberList;
