import { NextPage } from "next";
import { MainPage } from "./_layers";
import { CargoChangingFieldsContextProvider } from "./_features/Contexts";

const Page: NextPage = () => {
  return (
    <CargoChangingFieldsContextProvider>
      <MainPage />
    </CargoChangingFieldsContextProvider>
  );
};

export default Page;
