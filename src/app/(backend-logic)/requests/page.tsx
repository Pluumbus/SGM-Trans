import { NextPage } from "next";
import { ReqList } from "./_features/ReqList";

interface Props {}

const Page: NextPage<Props> = ({}) => {
  return (
    <div>
      <ReqList />
    </div>
  );
};

export default Page;
