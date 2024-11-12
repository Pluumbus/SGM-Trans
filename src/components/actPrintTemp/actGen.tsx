"use client";
import React from "react";
import Handlebars from "handlebars";
import { bodyHtmlTemp, stylesTemp } from "./act";
import { Button } from "@nextui-org/react";
import { clientBodyHtmlTemp, clientStylesTemp } from "./clientAct";
import { wrhBodyHtmlTemp, wrhStylesTemp } from "./wareHouseAct";
import { ActType, ClientsActType, WareHouseActType } from "./types";

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
    <Button
      color="success"
      onClick={handlePrintClick}
      className="w-full"
      variant="solid"
    >
      Печать
    </Button>
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
    <Button color="success" onClick={handlePrintClick} className="w-full">
      Печать шаблона для клиента
    </Button>
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
    console.log(actWrhData);
    if (printWindow) {
      const htmlContent = compiledTemplate({ items: actWrhData });
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
            ${htmlContent}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }
  };

  return (
    <Button color="success" onClick={handlePrintClick} fullWidth>
      Печать шаблона для склада
    </Button>
  );
};
