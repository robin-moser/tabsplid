import {ClipboardCopyIcon, MoveRight} from "lucide-react";
import {Member} from "../types";
import {Tooltip} from "react-tooltip";
import {useState} from "react";
import {useTranslation} from "react-i18next";

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

  const {t} = useTranslation(['project']);

  return (
    <div className="flex justify-between w-3/4 order-b-2 p-3 flex-1 items-center">

      <div className="flex flex-row gap-2 items-center">
        <span>{payment.from_member.name || t('project:placeholder.unnamed')}</span>
        <div>
          <MoveRight size={20} />
        </div>
        <span>{payment.to_member.name || t('project:placeholder.unnamed')}:</span>
      </div>

      <span className="
     bg-primary-200 dark:bg-primary-500 dark:bg-opacity-80 px-2 rounded-md
      ">{payment.amount}</span>
    </div>
  )
}

const PaymentList = ({payments}: PaymentListProps) => {

  const {t} = useTranslation(['project']);
  const [tooltipContent, setTooltipContent] = useState(t('project:placeholder.copyLinkToClipboard'));


  // balanced if no payments exist but number of expenses are > 0
  const isBalanced = payments.length === 0;

  return (
    <>
      <div className="
        bg-neutral-50 dark:bg-dark-600 shadow-neutral-200 dark:shadow-dark-900
        border-neutral-200 dark:border-dark-400 px-6 my-6 border rounded-lg shadow-lg
        text-neutral-800 dark:text-gray-300 w-full mx-auto">
        <div className="flex flex-col items-center">

          { /* display this only if payments exist */}
          {!isBalanced ? (
            <>
              <h3 className="w-full text-center font-bold text-lg border-b-2 py-4 dark:border-dark-50">{t('project:placeholder.howToSettleDepts')}</h3>
              {payments.map((payment, index) => (
                <PaymentItem key={index} payment={payment} />
              ))}
            </>
          ) : (
            <>
              <h3 className="w-full text-center font-bold text-lg py-4">{t('project:placeholder.noPaymentsRequired')}</h3>
            </>
          )}
        </div>
      </div>

      <div className="
        bg-neutral-50 dark:bg-dark-600 shadow-neutral-200 dark:shadow-dark-900
        border-neutral-200 dark:border-dark-400 px-6 mb-6 border rounded-lg shadow-lg
        text-neutral-800 dark:text-neutral-300 w-full mx-auto">
        <h3 className="w-full text-center font-bold text-lg border-b-2 py-4 mb-4 dark:border-dark-50">
          {t('project:placeholder.collaborate')}
        </h3>
        <p className="text-center w-5/6 mx-auto">
          {t('project:placeholder.shareTheLink')}
        </p>
        <Tooltip id="copy" content={tooltipContent} className="z-20" />
        <div className="flex justify-between items-center">
          <div className="overflow-scroll mr-0 py-4">
            <span className="text-primary-500 text-sm font-mono dark:text-primary-400 text-nowrap pr-4">
              {window.location.href}
            </span>
          </div>
          <div className="w-8 h-8 -ml-8 mr-4 z-10 flex-shrink-0 bg-gradient-to-r
            from-transparent to-neutral-50 dark:to-dark-600 to-90%" />
          <div>
            <ClipboardCopyIcon
              className="w-8 h-8 bg-zinc-200 dark:bg-dark-100 dark:text-white p-2 rounded-md"
              data-tooltip-id="copy"
              data-tooltip-content={tooltipContent}
              data-tooltip-place="bottom"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href)
                setTooltipContent(t('project:placeholder.copiedToClipboard'))
                setTimeout(() => {
                  setTooltipContent(t('project:placeholder.copyLinkToClipboard'));
                }, 1000)
              }}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default PaymentList;
