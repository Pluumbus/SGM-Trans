import { NextPage } from "next";
import { CashierTable } from "./_features";
import { CashboxModeContextProvider } from "./_features/Context";

interface Props {}

const Cashbox: NextPage<Props> = ({}) => {
  return (
    <CashboxModeContextProvider>
      <CashierTable />
    </CashboxModeContextProvider>
  );
};

export default Cashbox;
