import {useEffect, useState} from "react";
import {Expense, Member} from "../types";
import {CircleX, UserPen} from "lucide-react";
import {Tooltip} from "react-tooltip";
import {useTranslation} from "react-i18next";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

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
  const [expenseAmount, setExpenseAmount] = useState<string>(expense.amount?.toString() || '');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const {t} = useTranslation(['project']);

  const handleRemoveExpense = () => {
    setIsConfirmModalOpen(true);
  };

  const handleConfirm = () => {
    onDeleteExpense(memberId, expense);
    setIsConfirmModalOpen(false);
  };

  const handleClose = () => {
    setIsConfirmModalOpen(false);
  };

  useEffect(() => {
    setEditedExpense(expense);
  }, [expense]);

  useEffect(() => {
    onUpdateExpense(memberId, editedExpense);
  }, [memberId, editedExpense, onUpdateExpense]);

  useEffect(() => {
    const parsedAmount = parseFloat(expenseAmount);
    if (isNaN(parsedAmount)) {
      // If the input is not a valid number, reset to 0
      setEditedExpense((prevExpense) => ({...prevExpense, amount: 0}));
    } else {
      // Otherwise, update the amount
      setEditedExpense((prevExpense) => ({...prevExpense, amount: parsedAmount}));
    }
  }, [expenseAmount, setEditedExpense]);

  const toggleMemberSelection = (member: Member) => {
    const allMemberIds = allMembers.map((m) => m.id);

    // When involved_members is empty, treat all members as selected
    if (editedExpense.involved_members.length === 0) {
      const updatedInvolvedMembers = allMemberIds
        .filter((id) => id !== member.id) // Exclude the deselected member
        .map((id) => {
          const {id: mid, name, order} = allMembers.find((m) => m.id === id)!;
          return {name, order, id: mid} as Member;
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
          placeholder={t('project:placeholder.expenseName')}
          onChange={(e) => setEditedExpense({...editedExpense, name: e.target.value})}
        />
        <input
          className="w-1/2 px-2 py-2 border rounded-md member-input"
          value={expenseAmount || ''}
          placeholder={t('project:placeholder.expenseAmount')}
          inputMode="decimal"
          onChange={(e) => {
            const parsed = e.target.value
              .replace(/[^0-9,\\.]/g, '') // Remove non-numeric and non-comma/period characters
              .replace(/,/g, '.') // Replace commas with periods
              .replace(/(\..*?)\.+/g, '$1') // Remove extra periods
              .replace(/^(\d+(\.\d{0,2})?).*$/, '$1'); // Allow only two decimal places
            setExpenseAmount(parsed);
          }}
        />
      </div>
      <div className="flex mb-2 gap-2 items-center w-1/4 pl-2">
        <Tooltip id="expenseItem" />
        <ConfirmDeleteModal
          isOpen={isConfirmModalOpen}
          onClose={handleClose}
          onConfirm={handleConfirm}
          message={t('project:confirmDeleteExpense')}
        />
        <CircleX
          className="text-zinc-400 cst-icon-button"
          onClick={handleRemoveExpense}
          data-tooltip-content={t('project:tooltip.removeExpense')}
          data-tooltip-id="expenseItem"
        />
        <UserPen
          className={`cursor-pointer ${isInvolvedSubset() ? "!text-primary-500" : ""}
            cst-icon-button`}
          onClick={() => isModalOpen ? setIsModalOpen(false) : setIsModalOpen(true)}
          data-tooltip-content={t('project:tooltip.involvedMembers')}
          data-tooltip-id="expenseItem"
        />
      </div>

      {isModalOpen && (
        <div className="
          fixed inset-0 flex items-center justify-center
          bg-black bg-opacity-50 z-50 dark:bg-opacity-60">
          <div className="fixed inset-0 -z-10" onClick={() => setIsModalOpen(false)} />
          <div className="
            bg-white rounded-lg p-6 w-1/8 shadow-lg px-10
            dark:bg-dark-600 dark:border-dark-200 dark:border-2">
            <h2 className="text-xl font-semibold mb-4">{t('project:selectInvolvedMembers')}</h2>
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
                      dark:text-gray-100 dark:bg-dark-100 dark:border-dark-100 dark:hover:bg-dark-200
                      peer-checked:bg-primary-600 peer-checked:border-transparent peer-checked:text-white
                      peer-checked:hover:bg-primary-700">
                      {member.name || t('project:unnamedMember')}
                    </label>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-end mt-4 gap-2">
              <button
                className="px-4 py-2 bg-zinc-300 dark:bg-dark-100 rounded-md"
                onClick={() => setIsModalOpen(false)}
              >
                {t('project:button.close')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseItem;
