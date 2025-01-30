"use client";
import { useQueries, useQuery } from "@tanstack/react-query";
import { NextPage } from "next";
import { fetchBitrixLeads } from "../api/b24/getLeads";
import { LeadType } from "../api/types";

interface Props {}

const Page: NextPage<Props> = ({}) => {
  const { data } = useQuery({
    queryKey: ["TEST123"],
    queryFn: async () => await fetchBitrixLeads(),
  });
  console.log(data);
  // return <div className="flex gap-4">{data satisfies LeadType[]}</div>;
  return <div className="flex gap-4">{JSON.stringify(data)}</div>;
};

export default Page;
