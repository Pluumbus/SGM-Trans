import { NextPage } from "next";
import { CashierTable } from "./_features";

interface Props {}

const Cashbox: NextPage<Props> = ({}) => {
  return (
    <div>
      <div className="flex gap-2">
        <div className="flex flex-col gap-4">
          <span>
            Обсудить как добавлять баланс поподробнее. т.е. добавлять на груз и
            <br />
            отоброжать как баланс который был добавлен на груз, или добавлять в
            <br />
            общую кучу и погашать задолжности по грузам от последнего к первому
          </span>
          <span>
            Во втором случае гасить ли частично задолжность по грузу если не
            хватает на полное погашение?
          </span>
        </div>
        <div className="flex flex-col gap-4">
          <span>Какие еще операции добавить помимо измения баланса?</span>
          <span>
            Как меняется срок оплаты по договору? И с какого момента действует
            таймер для предупреждения логиста о неоплаченном грузе?
          </span>
        </div>
      </div>
      <CashierTable />
    </div>
  );
};

export default Cashbox;
