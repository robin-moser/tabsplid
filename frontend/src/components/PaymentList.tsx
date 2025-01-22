import {MoveRight} from "lucide-react";
import {Member} from "../types";

export interface Payment {
  from_member: Member,
  to_member: Member,
  amount: number
}

export interface PaymentProps {
  payment: Payment
}

export interface PaymentListProps {
  payments: Payment[],
}

const PaymentItem = ({payment}: PaymentProps) => {
  return (
    <div className="flex justify-between w-3/4 order-b-2 p-3 flex-1 items-center">

      <div className="flex flex-row gap-2 items-center">
        <span>{payment.from_member.name || "Unnamed"}</span>
        <div>
          <MoveRight size={20} />
        </div>
        <span>{payment.to_member.name || "Unnamed"}:</span>
      </div>

      <span className="
     bg-primary-200 dark:bg-primary-500 dark:bg-opacity-80 px-2 rounded-md
      ">{payment.amount}</span>
    </div>
  )
}

const PaymentList = ({payments}: PaymentListProps) => {

  // balanced if no payments exist but number of expenses are > 0
  const isBalanced = payments.length === 0;

  return (
    <div className="
      bg-neutral-50 dark:bg-zinc-800
      shadow-neutral-200 dark:shadow-zinc-950
      border-neutral-200 dark:border-zinc-700
      px-6 my-6 border rounded-lg shadow-lg
      text-neutral-800 dark:text-zinc-300
      w-full mx-auto">
      <div className="flex flex-col items-center">

        { /* display this only if payments exist */}
        {!isBalanced ? (
          <>
            <h3 className="w-full text-center font-bold text-lg border-b-2 py-4">How to settle depts</h3>
            {payments.map((payment, index) => (
              <PaymentItem key={index} payment={payment} />
            ))}
          </>
        ) : (
          <>
            <h3 className="w-full text-center font-bold text-lg py-4">No payments required</h3>
          </>
        )}

      </div>
    </div>
  )
}

export default PaymentList;
