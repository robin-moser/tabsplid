// src/types.ts

export interface Project {
    id: string;
    name: string | null;
    created_at: Date;
    updated_at: Date;
    members: Member[];
    payments: Payment[];
}

export interface Member {
    id: string;
    name: string | null;
    expenses: Expense[];
    balance: number;
}

export interface Expense {
    id: string;
    name: string | null;
    amount: number | null;
    involved_members: Member[];
}

export interface Payment {
    from_member: Member;
    to_member: Member;
    amount: number;
}
