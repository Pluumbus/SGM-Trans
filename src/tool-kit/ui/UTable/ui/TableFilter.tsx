// import { useCallback } from "react";
// import { useFilter } from "../hooks/useFilter";
// import { Input } from "@nextui-org/react";

// export const TableFilter = ({ headerId }: any) => {
//   const [filterValue, setFilterValue] = useFilter(headerId);

//   // eslint-disable-next-line react-hooks/rules-of-hooks
//   const handleChange = (e) => {
//     setFilterValue(e.target.value);
//   };

//   return (
//     <Input
//       isClearable
//       variant="underlined"
//       key={`filter-${headerId}`}
//       value={filterValue}
//       onChange={handleChange}
//       placeholder={`Filter by ${headerId}`}
//     />
//   );
// };

// 2nd var:

// import { Input } from "@nextui-org/react";

// export const TableFilter = ({ tInstance, headerId }: any) => {
//   const { setColumnFilters } = tInstance;
//   const filterState =
//     tInstance.getState().columnFilters.find((f) => f.id == headerId)?.value ||
//     "";
//   //   console.log("tInstance", tInstance);
//   //   console.log("headerId", headerId);
//   //   console.log("setColumnFilters", setColumnFilters);
//   //   console.log("filterState", filterState);

//   const onFilterChange = (value) =>
//     setColumnFilters((prev) =>
//       prev
//         .filter((f) => f.id !== headerId)
//         ?.concat({
//           id: headerId,
//           value,
//         })
//     );
//   return (
//     <Input
//       isClearable
//       variant="underlined"
//       key={`filter-${headerId}`}
//       value={filterState}
//       onChange={(e) => {
//         onFilterChange(e.target.value);
//       }}
//       placeholder={`Filter by ${headerId}`}
//     />
//   );
// };

// 3rd var: (gpt var) same хуйня
import { useState, useEffect } from "react";
import { Input } from "@nextui-org/react";

export const TableFilter = ({ tInstance, headerId, header }) => {
  const [filterValue, setFilterValue] = useState("");

  useEffect(() => {
    const currentFilter = tInstance
      .getState()
      .columnFilters.find((f) => f.id === headerId);
    setFilterValue(currentFilter?.value || "");
  }, []);

  const onFilterChange = (e) => {
    const value = e.target.value;
    setFilterValue(value);

    tInstance.setColumnFilters((prev) => {
      const otherFilters = prev.filter((f) => f.id !== headerId);
      return [...otherFilters, { id: headerId, value }];
    });
  };

  return (
    <Input
      isClearable
      onClick={() => {
        console.log(header);
      }}
      variant="underlined"
      value={filterValue}
      onChange={onFilterChange}
      placeholder={`Отсортировать по ${header}`}
    />
  );
};
