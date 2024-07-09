import { NextPage } from "next";
import SlugRender from "./baseRender";

interface Props {}

const Page: NextPage<Props> = ({}) => {
  return <SlugRender />;
};
export default Page;

export async function generateStaticParams() {
  return [];
}
