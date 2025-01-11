import RoleBasedWrapper from "@/components/RoleManagment/RoleBasedWrapper";
import { CargoType } from "../../../../../../../_feature/types";
import {
  PrintClientButton,
  PrintMscButton,
  PrintWarehouseButton,
} from "@/components/ActPrinter/actGen";
import {
  ClientsActType,
  MscActType,
  WareHouseActType,
} from "@/components/ActPrinter/types";
import { getDriversWithCars } from "@/lib/references/drivers/feature/api";
import { useQuery } from "@tanstack/react-query";

export const MngrClientButton = ({ cargos }: { cargos: CargoType[] }) => {
  const filteredCargos = cargos.filter(
    (cargo) => cargo.amount?.type === "Б/нал"
  );
  const actClientData = filteredCargos.map((crg) => {
    return {
      amount: crg.amount.value,
      client_bin: crg.client_bin.tempText,
      transportation_manager: crg.client_bin.tempText,
      unloading_point:
        crg.unloading_point.city +
        " " +
        (crg.unloading_point.deliveryAddress || ""),
    } as ClientsActType;
  });
  return (
    <div>
      <RoleBasedWrapper allowedRoles={["Менеджер", "Админ"]}>
        <PrintClientButton actClientData={actClientData} />
      </RoleBasedWrapper>
    </div>
  );
};

export const MngrWrhButton = ({ cargos }: { cargos: CargoType[] }) => {
  const actWrhData = cargos.map((crg) => {
    return {
      client_bin: crg.client_bin.tempText,
      transportation_manager: crg.client_bin.tempText,
      unloading_point:
        crg.unloading_point.city +
        " " +
        (crg.unloading_point.deliveryAddress || ""),
      cargo_name: crg.cargo_name,
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

export const MngrMscButton = ({ cargos }: { cargos: CargoType[] }) => {
  const { data, isLoading } = useQuery({
    queryKey: ["getDriversWithGazellCars"],
    queryFn: getDriversWithCars,
  });
  const actMscData = cargos.map((crg) => {
    console.log(crg.driver);
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
