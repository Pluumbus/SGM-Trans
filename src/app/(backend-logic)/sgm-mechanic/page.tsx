import { NextPage } from "next";
import { fetchFromAPI, getJWTToken, getVehiclesTree } from "./_api/requests";

interface Props {}

const Page: NextPage<Props> = async ({}) => {
  const data = await getVehiclesTree();
  return (
    <div>
      {data ? <pre>{JSON.stringify(data, null, 2)}</pre> : <p>Loading...</p>}
    </div>
  );
};

// return (
//   <div>
//     <CarList />
//   </div>
// );

export default Page;
