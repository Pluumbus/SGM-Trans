import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { NextPage } from "next";
import { getCargos } from "../_api";
import { WorkflowPage } from "./_features/Page";

const Page: NextPage = async ({}) => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["cargos"],
    queryFn: async () => await getCargos(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <WorkflowPage />
    </HydrationBoundary>
  );
};

export default Page;
