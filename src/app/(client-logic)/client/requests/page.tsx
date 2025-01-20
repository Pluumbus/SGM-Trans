import { NextPage } from "next";
import { RequestsList } from "./_features";

interface Props {}

const Page: NextPage<Props> = ({}) => {
  return (
    <div>
      <RequestsList />
    </div>
  );
};

export default Page;
