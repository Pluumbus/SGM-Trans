import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { useRowsPerPage } from "../hooks";

export const SelectRowsPerPage = ({ tInstance }: any) => {
  const { rowsPerPage, setRowsPerPage } = useRowsPerPage();
  const handleRowsChange = (e: string) => {
    setRowsPerPage(e);
    tInstance.setPageSize(Number(e));
  };

  return (
    <div className="flex items-center gap-2">
      <span>Выберите колличество строк на странице: </span>
      <Autocomplete
        className="w-48"
        selectedKey={rowsPerPage}
        onSelectionChange={(e: any) => {
          handleRowsChange(e);
        }}
      >
        <AutocompleteItem key={5} value={"5"}>
          5
        </AutocompleteItem>
        <AutocompleteItem key={10} value={"10"}>
          10
        </AutocompleteItem>
        <AutocompleteItem key={20} value={"20"}>
          20
        </AutocompleteItem>
        <AutocompleteItem key={50} value={"50"}>
          50
        </AutocompleteItem>
      </Autocomplete>
    </div>
  );
};
