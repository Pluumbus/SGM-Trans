import {
  Autocomplete,
  AutocompleteItem,
  AutocompleteProps,
  Tooltip,
} from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import { getClientsNames } from "../../cashbox/_features/api";
import { useEffect, useState } from "react";
import { useDebounce } from "@/tool-kit/hooks";

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
    queryKey: ["GetClientForAutocomplete"],
    queryFn: async () => await getClientsNames(),
  });

  const [value, setValue] = useState<string>(state[0]?.toString() || "");

  const { debounce } = useDebounce();
  const updateState = () => {
    setValue(state[0].toString());
    onChange && onChange();
  };

  useEffect(() => {
    if (state[0]) {
      debounce(updateState, 100);
    }
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
            textValue={
              e.client.full_name.first_name + " " + e.client.company_name
            }
          >
            <Tooltip content={<span>{str(e)}</span>}>
              <span>{shortStr(e)}</span>
            </Tooltip>
          </AutocompleteItem>
        ))}
    </Autocomplete>
  );
};
const shortStr = (e): string => e.client.company_name;

const str = (e): string =>
  `${
    e.client.full_name.first_name +
    " " +
    e.client.full_name.last_name +
    " " +
    e.client.company_name +
    " " +
    e.client.phone_number
  }`;
