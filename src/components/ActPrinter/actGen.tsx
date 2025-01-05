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
    <div>
      <Button color="success" onPress={handlePrintClick}>
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
      <Button color="success" onPress={handlePrintClick}>
        Печать для бухгалтера
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
    <div>
      <Button color="success" onPress={handlePrintClick}>
        Печать для склада
      </Button>
    </div>
  );
};
