import {useEffect, useState} from "react";
import {Expense, Member} from "../types";
import {CircleMinus, Users} from "lucide-react";

interface ExpenseItemProps {
  memberId: string;
  expense: Expense;
  onUpdateExpense: (memberId: string, expense: Expense) => void;
  onDeleteExpense: (memberId: string, expense: Expense) => void;
  allMembers: Member[];
}

const ExpenseItem: React.FC<ExpenseItemProps> = (
  {memberId, expense, onUpdateExpense, onDeleteExpense, allMembers}) => {

  const [editedExpense, setEditedExpense] = useState<Expense>(expense);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setEditedExpense(expense);
  }, [expense]);

  useEffect(() => {
    onUpdateExpense(memberId, editedExpense);
  }, [editedExpense]);

  const handleRemoveExpense = () => {
    onDeleteExpense(memberId, expense);
  };

  const toggleMemberSelection = (member: Member) => {
    const allMemberIds = allMembers.map((m) => m.id);

    // When involved_members is empty, treat all members as selected
    if (editedExpense.involved_members.length === 0) {
      const updatedInvolvedMembers = allMemberIds
        .filter((id) => id !== member.id) // Exclude the deselected member
        .map((id) => {
          const {id: mid, name} = allMembers.find((m) => m.id === id)!;
          return {name, id: mid} as Member;
        }); // Map back to Member objects
      setEditedExpense({...editedExpense, involved_members: updatedInvolvedMembers});
      return;
    }

    // Otherwise, modify the existing involved_members array
    const isSelected = editedExpense.involved_members.some((m) => m.id === member.id);
    const updatedInvolvedMembers = isSelected
      ? editedExpense.involved_members.filter((m) => m.id !== member.id) // Deselect
      : [...editedExpense.involved_members, {name: member.name, id: member.id}] as Member[]; // Select

    // If all members are selected after the change, reset to empty for shorthand
    const isAllSelected = updatedInvolvedMembers.length === allMembers.length;
    setEditedExpense({...editedExpense, involved_members: isAllSelected ? [] : updatedInvolvedMembers});
  };

  const getEffectiveMembers = () => {
    return editedExpense.involved_members.length === 0
      ? allMembers // Treat empty `involved_members` as all members selected
      : editedExpense.involved_members;
  };

  const isInvolvedSubset = () => {
    return editedExpense.involved_members.length > 0
      && editedExpense.involved_members.length < allMembers.length;
  }

  return (
    <div className="flex flex-row items-center justify-between">
      <div className="flex mb-2 gap-2 items-center w-3/4">
        <input
          className="w-full px-2 py-2 border rounded-md member-input"
          type="text"
          value={editedExpense.name || ''}
          onChange={(e) => setEditedExpense({...editedExpense, name: e.target.value})}
        />
        <input
          className="w-1/2 px-2 py-2 border rounded-md member-input"
          value={editedExpense.amount || ''}
          onChange={(e) => {
            const input = e.target.value;
            const parsed = parseInt(input) || editedExpense.amount;
            setEditedExpense({...editedExpense, amount: input === '' ? null : parsed, });
          }}
        />
      </div>
      <div className="flex mb-2 gap-2 items-center w-1/4 pl-2">
        <CircleMinus
          size={20}
          className="cursor-pointer text-zinc-400"
          onClick={handleRemoveExpense}
        />
        <Users
          size={20}
          className={`cursor-pointer ${isInvolvedSubset() ? "text-primary-500" : "text-zinc-400"}`}
          onClick={() => isModalOpen ? setIsModalOpen(false) : setIsModalOpen(true)}
        />
      </div>


      {isModalOpen && (
        <div className="
          fixed inset-0 flex items-center justify-center
          bg-black bg-opacity-50 z-50 dark:bg-opacity-60">
          <div className="fixed inset-0 -z-10" onClick={() => setIsModalOpen(false)} />
          <div className="
          bg-white rounded-lg p-6 w-1/8 shadow-lg px-10
          dark:bg-zinc-800 dark:border-zinc-600 dark:border-2">
            <h2 className="text-xl font-semibold mb-4">Select Involved Members</h2>
            <div className="flex flex-col gap-2">
              {allMembers.map((member) => {
                const effectiveMembers = getEffectiveMembers();
                const isChecked = effectiveMembers.some((m) => m.id === member.id);
                return (
                  <div key={member.id}>
                    <input
                      className="hidden peer"
                      type="checkbox"
                      id={member.id}
                      checked={isChecked}
                      onChange={() => toggleMemberSelection(member)}
                    />
                    <label htmlFor={member.id} className="
                  inline-flex items-center justify-between w-full p-3 rounded-lg cursor-pointer border-2
                  text-zinc-800 bg-white border-zinc-200 hover:bg-zinc-100
                  dark:text-zinc-100 dark:bg-zinc-700 dark:border-zinc-600 dark:hover:bg-zinc-600
                  peer-checked:bg-primary-600 peer-checked:border-transparent peer-checked:text-white
                  peer-checked:hover:bg-primary-700">
                      {member.name || "Unnamed Member"}
                    </label>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-end mt-4 gap-2">
              <button
                className="px-4 py-2 bg-zinc-300 dark:bg-zinc-600 rounded-md"
                onClick={() => setIsModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseItem;
