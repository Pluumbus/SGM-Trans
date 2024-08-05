
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

export async function generateStaticParams() {
  const slugs = ["1"];

  return slugs.map((slug) => ({
    slug,
  }));
}

export default Page;

// "use client";
// import { NextPage } from "next";
// import { UTable } from "@/tool-kit/ui";
// import { UseTableConfig } from "@/tool-kit/ui/UTable/types";
// import { useParams } from "next/navigation";
// import { useMemo } from "react";
// import { CargoType } from "../../_feature/types";
// import { getBaseColumnsConfig } from "./Table/CargoTable.config";
// import mockData from "./Table/mock.data";

// const Page: NextPage = ({}) => {
// const columns = useMemo(() => getBaseColumnsConfig(), []);
// const config: UseTableConfig<CargoType> = {
//   row: {
//     setRowData(info) {},
//     className: "cursor-pointer",
//   },
// };

//   const mMockData = useMemo(() => {
//     return mockData;
//   }, []);
//   const { id } = useParams();

//   return (
//     <div>
//       <div>
//         <span>Номер рейса: {id}</span>
//       </div>
//       <UTable
//         data={mMockData}
//         columns={columns}
//         name="Cargo Table"
//         config={config}
//       />
//     </div>
//   );
// };

// export default Page;
