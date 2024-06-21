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
      header: "Created At",
      size: 20,
      cell: (info: Cell<Cargo, ReactNode>) => (
        <span>{info.getValue()?.toString()}</span>
      ),
      filter: false,
    },
    {
      accessorKey: "receipt_address",
      header: "Receipt Address",
      size: 30,
      cell: (info: Cell<Cargo, ReactNode>) => (
        <span>{info.getValue()?.toString()}</span>
      ),
      filter: false,
    },
    {
      accessorKey: "unloading_city",
      header: "Unloading City",
      size: 20,
      cell: (info: Cell<Cargo, ReactNode>) => (
        <span>{info.getValue()?.toString()}</span>
      ),
      filter: false,
    },
    {
      accessorKey: "weight",
      header: "Weight",
      size: 15,
      cell: (info: Cell<Cargo, ReactNode>) => (
        <span>{info.getValue()?.toString()}</span>
      ),
      filter: false,
    },
    {
      accessorKey: "volume",
      header: "Volume",
      size: 15,
      cell: (info: Cell<Cargo, ReactNode>) => (
        <span>{info.getValue()?.toString()}</span>
      ),
      filter: false,
    },
    {
      accessorKey: "quantity",
      header: "Quantity",
      size: 15,
      cell: (info: Cell<Cargo, ReactNode>) => (
        <span>{info.getValue()?.toString()}</span>
      ),
      filter: false,
    },
    {
      accessorKey: "driver",
      header: "Driver",
      size: 20,
      cell: (info: Cell<Cargo, ReactNode>) => (
        <span>{info.getValue()?.toString()}</span>
      ),
      filter: false,
    },
    {
      accessorKey: "amount",
      header: "Amount",
      size: 15,
      cell: (info: Cell<Cargo, ReactNode>) => (
        <span>{info.getValue()?.toString()}</span>
      ),
      filter: false,
    },
    {
      accessorKey: "is_unpalletizing",
      header: "Is Unpalletizing",
      size: 15,
      cell: (info: Cell<Cargo, ReactNode>) => (
        <span>{info.getValue()?.toString()}</span>
      ),
      filter: false,
    },
    {
      accessorKey: "comments",
      header: "Comments",
      size: 25,
      cell: (info: Cell<Cargo, ReactNode>) => (
        <span>{info.getValue()?.toString()}</span>
      ),
      filter: false,
    },
    {
      accessorKey: "client_name",
      header: "Client Name",
      size: 25,
      cell: (info: Cell<Cargo, ReactNode>) => (
        <span>{info.getValue()?.toString()}</span>
      ),
      filter: false,
    },
    {
      accessorKey: "client_bin",
      header: "Client BIN",
      size: 20,
      cell: (info: Cell<Cargo, ReactNode>) => (
        <span>{info.getValue()?.toString()}</span>
      ),
      filter: false,
    },
    {
      accessorKey: "cargo_name",
      header: "Cargo Name",
      size: 25,
      cell: (info: Cell<Cargo, ReactNode>) => (
        <span>{info.getValue()?.toString()}</span>
      ),
      filter: false,
    },
    {
      accessorKey: "payer",
      header: "Payer",
      size: 20,
      cell: (info: Cell<Cargo, ReactNode>) => (
        <span>{info.getValue()?.toString()}</span>
      ),
      filter: false,
    },
    {
      accessorKey: "transportation_manager",
      header: "Transportation Manager",
      size: 25,
      cell: (info: Cell<Cargo, ReactNode>) => (
        <span>{info.getValue()?.toString()}</span>
      ),
      filter: false,
    },
    {
      accessorKey: "is_documents",
      header: "Is Documents",
      size: 15,
      cell: (info: Cell<Cargo, ReactNode>) => (
        <span>{info.getValue()?.toString()}</span>
      ),
      filter: false,
    },
    {
      accessorKey: "status",
      header: "Status",
      size: 20,
      cell: (info: Cell<Cargo, ReactNode>) => (
        <span>{info.getValue()?.toString()}</span>
      ),
      filter: false,
    },
    {
      accessorKey: "arrival_date",
      header: "Arrival Date",
      size: 20,
      cell: (info: Cell<Cargo, ReactNode>) => (
        <span>{info.getValue()?.toString()}</span>
      ),
      filter: false,
    },
    {
      accessorKey: "sgm_manager",
      header: "SGM Manager",
      size: 25,
      cell: (info: Cell<Cargo, ReactNode>) => (
        <span>{info.getValue()?.toString()}</span>
      ),
      filter: false,
    },
    {
      accessorKey: "payment",
      header: "Payment",
      size: 20,
      cell: (info: Cell<Cargo, ReactNode>) => (
        <span>{info.getValue()?.toString()}</span>
      ),
      filter: false,
    },
    {
      accessorKey: "loading_scheme",
      header: "Loading Scheme",
      size: 25,
      cell: (info: Cell<Cargo, ReactNode>) => (
        <span>{info.getValue()?.toString()}</span>
      ),
      filter: false,
    },
    {
      accessorKey: "user_id",
      header: "User ID",
      size: 15,
      cell: (info: Cell<Cargo, ReactNode>) => (
        <span>{info.getValue()?.toString()}</span>
      ),
      filter: false,
    },
  ];

  return columnsConfig;
};
