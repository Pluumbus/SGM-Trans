import { NextPage } from "next";
import RenderUiTable from "./tbRender";

const Page: NextPage = ({}) => {
  return <RenderUiTable />;
};

export default Page;

export async function generateStaticParams() {
  return [];
}
