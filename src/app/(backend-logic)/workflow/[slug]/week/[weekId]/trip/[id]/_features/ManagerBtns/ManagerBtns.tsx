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
import * as XLSX from "xlsx";
import {
  Alert,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { FC } from "react";
import { TripType } from "@/app/(backend-logic)/workflow/_feature/TripCard/TripCard";
import { FaFileAlt } from "react-icons/fa";

type DownloadExcelButtonProps = {
  cargos: CargoType[];
  trip: TripType;
};
export const AllManagerButtons = ({
  cargos,
  trip,
}: {
  cargos: CargoType[];
  trip: TripType;
}) => {
  return (
    <Dropdown>
      <DropdownTrigger>
        <Button variant="flat" color="success">
          <FaFileAlt size={25} />
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Static Actions">
        <DropdownItem key="copyToExcel">
          <ExportToExcel cargos={cargos} trip={trip} />
        </DropdownItem>
        <DropdownItem key="Msc">
          <MngrMscButton cargos={cargos} />
        </DropdownItem>
        <DropdownItem key="Acc">
          <MngrAccButton cargos={cargos} />
        </DropdownItem>
        <DropdownItem key="Wh">
          <MngrWrhButton cargos={cargos} />
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export const MngrAccButton = ({ cargos }: { cargos: CargoType[] }) => {
  const filteredCargos = cargos.filter(
    (cargo) => cargo.amount?.type === "Б/нал"
  );
  const { data } = useQuery({
    queryKey: ["GetClientForAutocomplete"],
    queryFn: async () => await getClientsNames(),
  });
  const actAccountantData = filteredCargos.map((crg) => {
    const tm = data?.find((d) => d.id === crg.transportation_manager);

    return {
      amount: crg.amount.value,
      transportation_manager:
        tm?.client.full_name.first_name + " " + tm?.client.phone_number,
      unloading_point: crg.unloading_point.city,
      receipt_address: crg.receipt_address,
    } as AccountantActType;
  });
  return (
    <div>
      <RoleBasedWrapper
        allowedRoles={["Менеджер", "Админ", "Логист Москва", "Супер Логист"]}
      >
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
      status: new Date(crg.status).toLocaleDateString(),
    } as MscActType;
  });
  return (
    <div>
      <RoleBasedWrapper
        allowedRoles={["Менеджер", "Админ", "Логист Москва", "Супер Логист"]}
      >
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
    const tm = data?.find((d) => d.id === crg.transportation_manager);
    return {
      client_bin: crg.client_bin.tempText,
      transportation_manager:
        tm?.client.full_name.first_name + " " + tm?.client.phone_number,
      unloading_point:
        crg.unloading_point.city +
        " " +
        (crg.unloading_point.deliveryAddress || ""),
      cargo_name: crg.cargo_name,
      quantity_type: crg.quantity.type,
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
      <RoleBasedWrapper
        allowedRoles={["Менеджер", "Админ", "Логист Москва", "Супер Логист"]}
      >
        <PrintWarehouseButton actWrhData={actWrhData} />
      </RoleBasedWrapper>
    </div>
  );
};

export const ExportToExcel: FC<DownloadExcelButtonProps> = ({
  cargos,
  trip,
}) => {
  const { data: UsersList } = useQuery({
    queryKey: ["getUsersList"],
    queryFn: async () => await getUserList(),
  });
  const { data: Drivers } = useQuery({
    queryKey: ["getDriversWithGazellCars"],
    queryFn: getDriversWithCars,
  });

  const flatData = cargos.map((cargo) => {
    const { data: TM } = useQuery({
      queryKey: [`manager info`, cargo.transportation_manager],
      queryFn: async ({ queryKey }) => await getClient(Number(queryKey[1])),
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
    });

    return {
      "Адрес получения": cargo.receipt_address,
      "Город разгрузки":
        cargo.unloading_point.city + " " + cargo.unloading_point.withDelivery
          ? cargo.unloading_point.deliveryAddress
          : "",
      Вес: cargo.weight,
      Объем: cargo.volume,
      "Кол-во": cargo.quantity.value + " " + cargo.quantity.type || "",
      Водитель: Drivers?.filter((d) => d.id === Number(cargo.driver.id))[0]
        ?.name,
      Сумма: cargo.amount.value + " " + (cargo.amount.type ?? ""),
      Распалечиваем: cargo.is_unpalletizing ? "Да" : "Нет",
      Комментарии: cargo.comments,
      "БИН Клиента":
        cargo.client_bin.xin +
        " " +
        cargo.client_bin.tempText +
        " " +
        cargo.client_bin.snts.join(", "),
      "Название груза": cargo.cargo_name,
      Плательщик:
        TM?.client.full_name.first_name +
        " " +
        TM?.client.phone_number +
        " " +
        TM?.client.company_name,
      "Наличие документов": cargo.is_documents ? "Да" : "Нет",
      Статус: cargo.status && cargo.status.slice(0, 10),
      "SGM Менеджер": UsersList?.filter((user) => user?.id === cargo.user_id)[0]
        ?.userName,
    };
  });
  const worksheet = XLSX.utils.json_to_sheet(flatData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Таблица");

  const download = () => {
    XLSX.writeFile(
      workbook,
      `${trip.trip_number} рейс,  ${trip.status} - ${trip.city_to}, ${trip.driver.driver + " " + trip.driver.state_number}.xlsx`
    );
  };

  return (
    <>
      <span onClick={download}>Экспортировать в Excel</span>
    </>
  );
};
