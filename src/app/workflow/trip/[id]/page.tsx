import { NextPage } from "next";
import { UTable } from "@/tool-kit/ui";
import mockData from "./Table/mock.data";
import { getBaseColumnsConfig } from "./Table/CargoTable.config";
import { UseTableConfig } from "@/tool-kit/ui/UTable/types";
import { CargoType } from "../../_feature/types";
interface Props {
  params: {
    id: string;
  };
}

const Page: NextPage<Props> = ({ params }) => {
  const { id } = params;

  const columns = getBaseColumnsConfig();
  const config: UseTableConfig<CargoType> = {
    row: {
      setRowData(info) {},
      className: "cursor-pointer",
    },
  };

  return (
    <div>
      <div>
        <div>
          <span>Номер рейса: {id}</span>
        </div>
        <UTable
          data={mockData}
          columns={columns}
          name="Cargo Table"
          config={config}
        />
      </div>
    </div>
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
