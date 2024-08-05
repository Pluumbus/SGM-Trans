import { NextPage } from "next";
import { WeekCard } from "./_feature/WeekCard";
import { getWeeks } from "./trip/_api";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

interface Props {}

const Page: NextPage<Props> = async ({}) => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["trips"],
    queryFn: async () => await getWeeks(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <WeekCard />
    </HydrationBoundary>
  );
};

export default Page;
