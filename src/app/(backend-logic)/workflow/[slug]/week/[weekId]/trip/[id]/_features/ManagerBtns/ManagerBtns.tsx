import RoleBasedWrapper from "@/components/RoleManagment/RoleBasedWrapper";
import { Button } from "@nextui-org/react";
import { CargoType } from "../../../../../../../_feature/types";
import {
  PrintClientButton,
  PrintWarehouseButton,
} from "@/components/ActPrinter/actGen";
import {
  ClientsActType,
  WareHouseActType,
} from "@/components/ActPrinter/types";

export const MngrClientButton = ({ cargos }: { cargos: CargoType[] }) => {
  const filteredCargos = cargos.filter(
    (cargo) =>
      cargo.amount?.type === "Б/нал" || cargo.amount?.type === "Б/нал в МСК",
  );

  const actClientData = filteredCargos.map((crg) => {
    return {
      amount: crg.amount.value,
      client_bin: crg.client_bin.tempText,
      transportation_manager: crg.transportation_manager,
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
      transportation_manager: crg.transportation_manager,
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
