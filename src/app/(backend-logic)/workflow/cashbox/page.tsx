import { NextPage } from "next";
import { CashierTable } from "./_features";

interface Props {}

const Cashbox: NextPage<Props> = ({}) => {
  return (
    <div>
      <CashierTable />
    </div>
  );
};

export default Cashbox;
