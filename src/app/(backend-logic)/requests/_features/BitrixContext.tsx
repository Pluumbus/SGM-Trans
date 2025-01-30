import { LeadType } from "@/app/api/types";
import { useDisclosure } from "@nextui-org/react";
import { ReactNode, useState, useContext, createContext } from "react";

interface LeadListContextValue {
  selectedLead: LeadType | null;
  setSelectedLead: React.Dispatch<React.SetStateAction<LeadType | null>>;
  disclosure: ReturnType<typeof useDisclosure> | null;
  tripDisclosure: ReturnType<typeof useDisclosure> | null;
}

const LeadListContext = createContext<LeadListContextValue>({
  selectedLead: null,
  setSelectedLead: () => {},
  disclosure: null,
  tripDisclosure: null,
});

export const LeadListContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [selectedLead, setSelectedLead] = useState(null);
  const disclosure = useDisclosure();
  const tripDisclosure = useDisclosure();

  return (
    <LeadListContext.Provider
      value={{ selectedLead, setSelectedLead, disclosure, tripDisclosure }}
    >
      {children}
    </LeadListContext.Provider>
  );
};

export const useLeadItem = () => useContext(LeadListContext);
