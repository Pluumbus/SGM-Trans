import {
  Autocomplete,
  AutocompleteItem,
  AutocompleteProps,
} from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import { getClients } from "../../cashbox/_features/api";
import { str } from "./TM";
import { useEffect, useState } from "react";

export const ExistingClients = ({
  state,
  onChange,
  props,
}: {
  state: [number, React.Dispatch<React.SetStateAction<number>>];
  onChange?: () => void;
  props?: Omit<AutocompleteProps, "children">;
}) => {
  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ["get clients for autocomplete"],
    queryFn: async () => await getClients(),
  });

  const [value, setValue] = useState<string>(state[0]?.toString() || "");

  useEffect(() => {
    if (state[0]) {
      setValue(state[0].toString());
      onChange && onChange();
    }
    refetch();
  }, [state[0]]);

  return (
    <Autocomplete
      isLoading={isLoading || isRefetching}
      label={"Плательщик (Менеджер ведущий перевозку)"}
      selectedKey={value}
      onSelectionChange={(e) => {
        setValue(e?.toString() || "");
        state[1](Number(e?.toString()));
      }}
      {...props}
    >
      {data &&
        data.map((e) => (
          <AutocompleteItem
            value={e.id}
            key={e.id}
            textValue={str(e) + " " + e.client.company_name}
          >
            <span>{str(e) + " " + e.client.company_name}</span>
          </AutocompleteItem>
        ))}
    </Autocomplete>
  );
};
