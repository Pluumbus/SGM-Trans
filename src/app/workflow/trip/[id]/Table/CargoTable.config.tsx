"use client";
import { UseTableColumnsSchema } from "@/tool-kit/ui";
import { Cell } from "@tanstack/react-table";
import { ReactNode } from "react";
import { Cargo } from "../types";

export const getBaseColumnsConfig = () => {
  const columnsConfig: UseTableColumnsSchema<Cargo>[] = [
    {
      accessorKey: "id",
      accessorFn: () => {},
      header: "ID",
      size: 10,
      cell: (info: Cell<Cargo, ReactNode>) => (
        <span>{info.getValue()?.toString()}</span>
      ),
      filter: false,
    },
    {
      accessorKey: "created_at",
      accessorFn: () => {},
      header: "Дата создания",
      size: 20,
      cell: (info: Cell<Cargo, ReactNode>) => (
        <span>{new Date(info?.getValue() as string).toLocaleDateString()}</span>
      ),
      filter: true,
    },
    {
      accessorKey: "receipt_address",
      accessorFn: () => {},
      header: "Адрес получения",
      size: 30,
      cell: (info: Cell<Cargo, ReactNode>) => (
        <span>{info.getValue()?.toString()}</span>
      ),
      filter: false,
    },
    {
      accessorKey: "unloading_city",
      accessorFn: () => {},
      header: "Город разгрузки",
      size: 20,
      cell: (info: Cell<Cargo, ReactNode>) => (
        <span>{info.getValue()?.toString()}</span>
      ),
      filter: false,
    },
    {
      accessorKey: "weight",
      accessorFn: () => {},
      header: "Вес",
      size: 15,
      cell: (info: Cell<Cargo, ReactNode>) => (
        <span>{info.getValue()?.toString()}</span>
      ),
      filter: false,
    },
    {
      accessorKey: "volume",
      accessorFn: () => {},
      header: "Объем",
      size: 15,
      cell: (info: Cell<Cargo, ReactNode>) => (
        <span>{info.getValue()?.toString()}</span>
      ),
      filter: false,
    },
    {
      accessorKey: "quantity",
      accessorFn: () => {},
      header: "Количество",
      size: 15,
      cell: (info: Cell<Cargo, ReactNode>) => (
        <span>{info.getValue()?.toString()}</span>
      ),
      filter: false,
    },
    {
      accessorKey: "driver",
      accessorFn: () => {},
      header: "Водитель",
      size: 20,
      cell: (info: Cell<Cargo, ReactNode>) => (
        <span>{info.getValue()?.toString()}</span>
      ),
      filter: false,
    },
    {
      accessorKey: "amount",
      accessorFn: () => {},
      header: "Сумма",
      size: 15,
      cell: (info: Cell<Cargo, ReactNode>) => (
        <span>{info.getValue()?.toString()}</span>
      ),
      filter: false,
    },
    {
      accessorKey: "is_unpalletizing",
      accessorFn: () => {},
      header: "Распалетирование",
      size: 15,
      cell: (info: Cell<Cargo, ReactNode>) => (
        <span>{info.getValue()?.toString()}</span>
      ),
      filter: false,
    },
    {
      accessorKey: "comments",
      accessorFn: () => {},
      header: "Комментарии",
      size: 25,
      cell: (info: Cell<Cargo, ReactNode>) => (
        <span>{info.getValue()?.toString()}</span>
      ),
      filter: false,
    },
    {
      accessorKey: "client_name",
      accessorFn: () => {},
      header: "Имя клиента",
      size: 25,
      cell: (info: Cell<Cargo, ReactNode>) => (
        <span>{info.getValue()?.toString()}</span>
      ),
      filter: false,
    },
    {
      accessorKey: "client_bin",
      accessorFn: () => {},
      header: "БИН клиента",
      size: 20,
      cell: (info: Cell<Cargo, ReactNode>) => (
        <span>{info.getValue()?.toString()}</span>
      ),
      filter: false,
    },
    {
      accessorKey: "cargo_name",
      accessorFn: () => {},
      header: "Название груза",
      size: 25,
      cell: (info: Cell<Cargo, ReactNode>) => (
        <span>{info.getValue()?.toString()}</span>
      ),
      filter: false,
    },
    {
      accessorKey: "payer",
      accessorFn: () => {},
      header: "Плательщик",
      size: 20,
      cell: (info: Cell<Cargo, ReactNode>) => (
        <span>{info.getValue()?.toString()}</span>
      ),
      filter: false,
    },
    {
      accessorKey: "transportation_manager",
      accessorFn: () => {},
      header: "Менеджер по перевозкам",
      size: 25,
      cell: (info: Cell<Cargo, ReactNode>) => (
        <span>{info.getValue()?.toString()}</span>
      ),
      filter: false,
    },
    {
      accessorKey: "is_documents",
      accessorFn: () => {},
      header: "Наличие документов",
      size: 15,
      cell: (info: Cell<Cargo, ReactNode>) => (
        <span>{info.getValue()?.toString()}</span>
      ),
      filter: false,
    },
    {
      accessorKey: "status",
      accessorFn: () => {},
      header: "Статус",
      size: 20,
      cell: (info: Cell<Cargo, ReactNode>) => (
        <span>{info.getValue()?.toString()}</span>
      ),
      filter: false,
    },
    {
      accessorKey: "arrival_date",
      accessorFn: () => {},
      header: "Дата прибытия",
      size: 20,
      cell: (info: Cell<Cargo, ReactNode>) => (
        <span>{new Date(info.getValue() as string)?.toLocaleDateString()}</span>
      ),
      filter: false,
    },
    {
      accessorKey: "sgm_manager",
      accessorFn: () => {},
      header: "Менеджер SGM",
      size: 25,
      cell: (info: Cell<Cargo, ReactNode>) => (
        <span>{info.getValue()?.toString()}</span>
      ),
      filter: false,
    },
    {
      accessorKey: "payment",
      accessorFn: () => {},
      header: "Оплата",
      size: 20,
      cell: (info: Cell<Cargo, ReactNode>) => (
        <span>{info.getValue()?.toString()}</span>
      ),
      filter: false,
    },
    {
      accessorKey: "loading_scheme",
      accessorFn: () => {},
      header: "Схема загрузки",
      size: 25,
      cell: (info: Cell<Cargo, ReactNode>) => (
        <span>{info.getValue()?.toString()}</span>
      ),
      filter: false,
    },
    {
      accessorKey: "user_id",
      accessorFn: () => {},
      header: "ID пользователя",
      size: 15,
      cell: (info: Cell<Cargo, ReactNode>) => (
        <span>{info.getValue()?.toString()}</span>
      ),
      filter: false,
    },
  ];

  return columnsConfig;
};
