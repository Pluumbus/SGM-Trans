"use client";
import React from "react";
import Handlebars from "handlebars";
import { bodyHtmlTemp, stylesTemp } from "./act";
import { Button } from "@nextui-org/react";
import { clientBodyHtmlTemp, clientStylesTemp } from "./clientAct";
import { wrhBodyHtmlTemp, wrhStylesTemp } from "./wareHouseAct";

export type ActType = {
  client_bin: string;
  cargo_name: string;
  quantity: string;
  amount: string;
  date: string;
};

export type ClientsActType = {
  amount: string;
  transportation_manager: string;
  client_bin: string;
  unloading_point: string;
};

export type WareHouseActType = {
  unloading_point: string;
  cargo_name: string;
  weight: string;
  volume: string;
  quantity: string;
  client_bin: string;
  transportation_manager: string;
  comments: string;
};

export const PrintButton = ({ actData }: { actData: ActType }) => {
  const handlePrintClick = () => {
    const compiledTemplate = Handlebars.compile(bodyHtmlTemp);
    const renderedHtml = compiledTemplate(actData);

    const printWindow = window.open("", "", "width=800,height=600");
    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(`
        <html>
          <head>
            <title>Печать</title>
            <style>
              ${stylesTemp}
            </style>
          </head>
          <body>
            ${renderedHtml}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }
  };

  return (
    <div>
      <Button color="success" onClick={handlePrintClick}>
        Печать
      </Button>
      {/* <Image src={logo} alt="" width={156} height={120} /> */}
    </div>
  );
};

export const PrintClientButton = ({
  actClientData,
}: {
  actClientData: ClientsActType[];
}) => {
  const handlePrintClick = () => {
    const compiledTemplate = Handlebars.compile(clientBodyHtmlTemp);

    const printWindow = window.open("", "", "width=800,height=600");
    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(`
        <html>
          <head>
            <title>Печать</title>
            <style>
              ${clientStylesTemp}
            </style>
          </head>
          <body>
            ${actClientData.map((client) => compiledTemplate(client))}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }
  };

  return (
    <div>
      <Button color="success" onClick={handlePrintClick}>
        Печать шаблона для клиента
      </Button>
    </div>
  );
};

export const PrintWarehouseButton = ({
  actWrhData,
}: {
  actWrhData: WareHouseActType[];
}) => {
  const handlePrintClick = () => {
    const compiledTemplate = Handlebars.compile(wrhBodyHtmlTemp);

    const printWindow = window.open("", "", "width=800,height=600");
    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(`
        <html>
          <head>
            <title>Печать</title>
            <style>
              ${wrhStylesTemp}
            </style>
          </head>
          <body>
            ${actWrhData.map((client) => compiledTemplate(client))}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }
  };

  return (
    <div>
      <Button color="success" onClick={handlePrintClick}>
        Печать шаблона для склада
      </Button>
    </div>
  );
};
