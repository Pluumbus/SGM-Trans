import { NextPage } from "next";
import RenderUiTable from "./tbRender";

const Page: NextPage = ({}) => {
  return (
    <div>
      <RenderUiTable />
      {/* <Cities />

      <div>
        <span>Номер рейса: {id}</span>
      </div>
      <UTable
        data={mMockData}
        columns={columns}
        name="Cargo Table"
        config={config}
      /> */}
    </div>
  );
};

export default Page;

export async function generateStaticParams() {
  return [];
}
