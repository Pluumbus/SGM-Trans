import RoleBasedWrapper from "@/components/RoleManagment/RoleBasedWrapper";
import { CargoType } from "../../../../../../../_feature/types";
import {
  PrintAccountantButton,
  PrintMscButton,
  PrintWarehouseButton,
} from "@/components/ActPrinter/actGen";
import {
  AccountantActType,
  MscActType,
  WareHouseActType,
} from "@/components/ActPrinter/types";
import { getDriversWithCars } from "@/lib/references/drivers/feature/api";
import { useQuery } from "@tanstack/react-query";
import {
  getClient,
  getClientsNames,
} from "@/app/(backend-logic)/workflow/cashbox/_features/api/server";
import { getUserList } from "@/lib/references/clerkUserType/getUserList";

export const MngrAccButton = ({ cargos }: { cargos: CargoType[] }) => {
  const filteredCargos = cargos.filter(
    (cargo) => cargo.amount?.type === "Б/нал"
  );
  const actAccountantData = filteredCargos.map((crg) => {
    return {
      amount: crg.amount.value,
      client_bin: crg.client_bin.tempText,
      unloading_point: crg.unloading_point.city,
      receipt_address: crg.receipt_address,
    } as AccountantActType;
  });
  return (
    <div>
      <RoleBasedWrapper allowedRoles={["Менеджер", "Админ"]}>
        <PrintAccountantButton actAccountantData={actAccountantData} />
      </RoleBasedWrapper>
    </div>
  );
};

export const MngrMscButton = ({ cargos }: { cargos: CargoType[] }) => {
  const { data } = useQuery({
    queryKey: ["getDriversWithGazellCars"],
    queryFn: getDriversWithCars,
  });
  const actMscData = cargos.map((crg) => {
    return {
      client_bin: crg.client_bin.tempText,
      receipt_address: crg.receipt_address,
      unloading_point: crg.unloading_point.city,
      cargo_name: crg.cargo_name,
      weight: crg.weight,
      volume: crg.volume,
      quantity: crg.quantity.value,
      driver: data?.filter((f) => f.id === Number(crg.driver.id))[0]?.name,
      is_documents: crg.is_documents ? "Да" : "Нет",
      is_unpalletizing: crg.is_unpalletizing ? "Да" : "Нет",
      status: crg.status,
    } as MscActType;
  });
  return (
    <div>
      <RoleBasedWrapper allowedRoles={["Менеджер", "Админ"]}>
        <PrintMscButton actMscData={actMscData} />
      </RoleBasedWrapper>
    </div>
  );
};

export const MngrWrhButton = ({ cargos }: { cargos: CargoType[] }) => {
  const { data } = useQuery({
    queryKey: ["GetClientForAutocomplete"],
    queryFn: async () => await getClientsNames(),
  });
  const { data: userData } = useQuery({
    queryKey: ["getUsersList"],
    queryFn: async () => getUserList(),
  });
  const actWrhData = cargos.map((crg) => {
    const tm = data?.filter((d) => d.id === crg.transportation_manager)[0];
    return {
      client_bin: crg.client_bin.tempText,
      transportation_manager:
        tm?.client.full_name.first_name + " " + tm?.client.phone_number,
      unloading_point:
        crg.unloading_point.city +
        " " +
        (crg.unloading_point.deliveryAddress || ""),
      cargo_name: crg.cargo_name,
      is_unpalletizing: crg.is_unpalletizing ? "Да" : "Нет",
      sgm_manager: userData?.filter((u) => u.id === crg.user_id)[0]?.userName,
      weight: crg.weight,
      volume: crg.volume,
      quantity: crg.quantity.value,
      comments: crg.comments,
    } as WareHouseActType;
  });
  return (
    <div>
      <RoleBasedWrapper allowedRoles={["Менеджер", "Админ"]}>
        <PrintWarehouseButton actWrhData={actWrhData} />
      </RoleBasedWrapper>
    </div>
  );
};
