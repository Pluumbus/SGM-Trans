import { NextPage } from "next";
import { MainPage } from "./_layers";
import {
  CargoChangingFieldsContextProvider,
  CargoTableProvider,
} from "./_features/Contexts";
import { UpdateCargoContextProvider } from "./_features/UpdateCargo";

const Page: NextPage = () => {
  return (
    <CargoChangingFieldsContextProvider>
      <UpdateCargoContextProvider>
        <CargoTableProvider>
          <MainPage />
        </CargoTableProvider>
      </UpdateCargoContextProvider>
    </CargoChangingFieldsContextProvider>
  );
};

export default Page;
