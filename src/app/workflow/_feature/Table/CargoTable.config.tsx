"use client";
import { UseTableColumnsSchema } from "@/tool-kit/ui";
import { Cell } from "@tanstack/react-table";
import { ReactNode } from "react";
import { Cargo } from "./types";

export const getBaseColumnsConfig = () => {
  const columnsConfig: UseTableColumnsSchema<Cargo> = [
    {
      accessorKey: "id",
      header: "ID",
      size: 10,
      cell: (info: Cell<Cargo, ReactNode>) => (
        <span>{info.getValue()?.toString()}</span>
      ),
      filter: false,
    },
    {
      accessorKey: "created_at",
      header: "Дата создания",
      size: 20,
      cell: (info: Cell<Cargo, ReactNode>) => (
        <span>{new Date(info?.getValue()).toLocaleDateString()}</span>
      ),
      filter: true,
    },
    {
      accessorKey: "receipt_address",
      header: "Адрес получения",
      size: 30,
      cell: (info: Cell<Cargo, ReactNode>) => (
        <span>{info.getValue()?.toString()}</span>
      ),
      filter: false,
    },
    {
      accessorKey: "unloading_city",
      header: "Город разгрузки",
      size: 20,
      cell: (info: Cell<Cargo, ReactNode>) => (
        <span>{info.getValue()?.toString()}</span>
      ),
      filter: false,
    },
    {
      accessorKey: "weight",
      header: "Вес",
      size: 15,
      cell: (info: Cell<Cargo, ReactNode>) => (
        <span>{info.getValue()?.toString()}</span>
      ),
      filter: false,
    },
    {
      accessorKey: "volume",
      header: "Объем",
      size: 15,
      cell: (info: Cell<Cargo, ReactNode>) => (
        <span>{info.getValue()?.toString()}</span>
      ),
      filter: false,
    },
    {
      accessorKey: "quantity",
      header: "Количество",
      size: 15,
      cell: (info: Cell<Cargo, ReactNode>) => (
        <span>{info.getValue()?.toString()}</span>
      ),
      filter: false,
    },
    {
      accessorKey: "driver",
      header: "Водитель",
      size: 20,
      cell: (info: Cell<Cargo, ReactNode>) => (
        <span>{info.getValue()?.toString()}</span>
      ),
      filter: false,
    },
    {
      accessorKey: "amount",
      header: "Сумма",
      size: 15,
      cell: (info: Cell<Cargo, ReactNode>) => (
        <span>{info.getValue()?.toString()}</span>
      ),
      filter: false,
    },
    {
      accessorKey: "is_unpalletizing",
      header: "Распалетирование",
      size: 15,
      cell: (info: Cell<Cargo, ReactNode>) => (
        <span>{info.getValue()?.toString()}</span>
      ),
      filter: false,
    },
    {
      accessorKey: "comments",
      header: "Комментарии",
      size: 25,
      cell: (info: Cell<Cargo, ReactNode>) => (
        <span>{info.getValue()?.toString()}</span>
      ),
      filter: false,
    },
    {
      accessorKey: "client_name",
      header: "Имя клиента",
      size: 25,
      cell: (info: Cell<Cargo, ReactNode>) => (
        <span>{info.getValue()?.toString()}</span>
      ),
      filter: false,
    },
    {
      accessorKey: "client_bin",
      header: "БИН клиента",
      size: 20,
      cell: (info: Cell<Cargo, ReactNode>) => (
        <span>{info.getValue()?.toString()}</span>
      ),
      filter: false,
    },
    {
      accessorKey: "cargo_name",
      header: "Название груза",
      size: 25,
      cell: (info: Cell<Cargo, ReactNode>) => (
        <span>{info.getValue()?.toString()}</span>
      ),
      filter: false,
    },
    {
      accessorKey: "payer",
      header: "Плательщик",
      size: 20,
      cell: (info: Cell<Cargo, ReactNode>) => (
        <span>{info.getValue()?.toString()}</span>
      ),
      filter: false,
    },
    {
      accessorKey: "transportation_manager",
      header: "Менеджер по перевозкам",
      size: 25,
      cell: (info: Cell<Cargo, ReactNode>) => (
        <span>{info.getValue()?.toString()}</span>
      ),
      filter: false,
    },
    {
      accessorKey: "is_documents",
      header: "Наличие документов",
      size: 15,
      cell: (info: Cell<Cargo, ReactNode>) => (
        <span>{info.getValue()?.toString()}</span>
      ),
      filter: false,
    },
    {
      accessorKey: "status",
      header: "Статус",
      size: 20,
      cell: (info: Cell<Cargo, ReactNode>) => (
        <span>{info.getValue()?.toString()}</span>
      ),
      filter: false,
    },
    {
      accessorKey: "arrival_date",
      header: "Дата прибытия",
      size: 20,
      cell: (info: Cell<Cargo, ReactNode>) => (
        <span>{new Date(info.getValue())?.toLocaleDateString()}</span>
      ),
      filter: false,
    },
    {
      accessorKey: "sgm_manager",
      header: "Менеджер SGM",
      size: 25,
      cell: (info: Cell<Cargo, ReactNode>) => (
        <span>{info.getValue()?.toString()}</span>
      ),
      filter: false,
    },
    {
      accessorKey: "payment",
      header: "Оплата",
      size: 20,
      cell: (info: Cell<Cargo, ReactNode>) => (
        <span>{info.getValue()?.toString()}</span>
      ),
      filter: false,
    },
    {
      accessorKey: "loading_scheme",
      header: "Схема загрузки",
      size: 25,
      cell: (info: Cell<Cargo, ReactNode>) => (
        <span>{info.getValue()?.toString()}</span>
      ),
      filter: false,
    },
    {
      accessorKey: "user_id",
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
