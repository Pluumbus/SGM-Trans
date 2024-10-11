import { NextPage } from "next";
import { CarList } from "./_features/CarList";

interface Props {}

const Page: NextPage<Props> = ({}) => {
  return (
    <div>
      <CarList />
    </div>
  );
};

export default Page;
