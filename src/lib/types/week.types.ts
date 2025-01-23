import { DocumentType } from "./document.types";
import { GeneralTableType } from "./general.types";

type CountryWeekType = "kz" | "ru";

export type WeekDTOType = {
  week_number: number;
  table_type: CountryWeekType;
  week_dates: {
    end_date: string;
    start_date: string;
  };
  docs: { doc: DocumentType[] };
};

export type WeekTableType = WeekDTOType & GeneralTableType;
