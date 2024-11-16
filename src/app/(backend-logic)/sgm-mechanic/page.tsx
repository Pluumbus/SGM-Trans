import { NextPage } from "next";
import { CarList } from "./_features/CarList";
import { useState, useEffect } from "react";
import { fetchFromAPI, getJWTToken } from "./_api/requests";

interface Props {}

const Page: NextPage<Props> = async ({}) => {
  const data = await getJWTToken();
  return (
    <div>
      <h1>Data from API with JWT and Refresh Token</h1>
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
