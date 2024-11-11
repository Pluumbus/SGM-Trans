import { NextPage } from "next";
import { CarList } from "./_features/CarList";
import { useState, useEffect } from "react";
import { fetchFromAPI, getJWTToken } from "./_api/requests";

interface Props {}

const Page: NextPage<Props> = ({}) => {
  let data;
  const getData = async () => {
    try {
      const result = await getJWTToken();
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  };

  data = getData();
  // console.log(data);
  return (
    <div>
      <h1>Data from API with JWT and Refresh Token</h1>
      {data ? (
        <pre>
          {/* {JSON.stringify(data, null, 2)} */}
          {data}
        </pre>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

// return (
//   <div>
//     <CarList />
//   </div>
// );

export default Page;
