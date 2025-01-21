import {Member, Payment} from "../types";

export const calculatePayments = (members: Member[]): Payment[] => {

    const updatedProjectPayments: Payment[] = [];
    members.forEach(member => {
        member.balance = 0;
    });

    members.forEach(member => {
        member.expenses.forEach(expense => {
            if (!expense.amount) return;
            const amount = expense.amount;
            const involvedMembers = expense.involved_members.length > 0
                ? members.filter(m => expense.involved_members.map(m => m.id).includes(m.id))
                : members;

            involvedMembers.forEach(involvedMember => {
                involvedMember.balance -= amount / involvedMembers.length;
            });

            member.balance += amount;
        });
    });

    members.forEach(member => {
        if (member.balance < 0) {
            members.forEach(otherMember => {
                if (otherMember.balance > 0) {
                    const amount = Math.min(-member.balance, otherMember.balance);
                    updatedProjectPayments.push({
                        from_member: member,
                        to_member: otherMember,
                        amount: Math.round(amount * 100) / 100,
                    });
                    member.balance += amount;
                    otherMember.balance -= amount;
                }
            });
        }
    });

    return updatedProjectPayments;

};
