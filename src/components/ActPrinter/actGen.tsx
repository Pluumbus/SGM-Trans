"use client";
import React from "react";
import Handlebars from "handlebars";
import { bodyHtmlTemp, stylesTemp } from "./act";
import { Button, Tooltip } from "@nextui-org/react";
import { wrhBodyHtmlTemp, wrhStylesTemp } from "./wareHouseAct";
import {
  AccountantActType,
  ActType,
  MscActType,
  WareHouseActType,
} from "./types";
import { FaDownload } from "react-icons/fa";
import { mscBodyHtmlTemp } from "./mscAct";
import { accountantBodyHtmlTemp, accountantStylesTemp } from "./accountantAct";

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
      <Tooltip content={<span>Скачать Акт выдачи</span>}>
        <Button
          color="success"
          variant="flat"
          isIconOnly
          onPress={handlePrintClick}
        >
          <FaDownload />
        </Button>
      </Tooltip>
      {/* <Image src={logo} alt="" width={156} height={120} /> */}
    </div>
  );
};

export const PrintAccountantButton = ({
  actAccountantData,
}: {
  actAccountantData: AccountantActType[];
}) => {
  const handlePrintClick = () => {
    const compiledTemplate = Handlebars.compile(accountantBodyHtmlTemp);

    const printWindow = window.open("", "", "width=800,height=600");
    if (printWindow) {
      const htmlContent = compiledTemplate({ items: actAccountantData });

      printWindow.document.open();
      printWindow.document.write(`
        <html>
          <head>
            <title>Печать</title>
            <style>
              ${accountantStylesTemp}
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
    <>
      <span onClick={handlePrintClick}>Печать для бухгалтера</span>
    </>
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
    <>
      <span onClick={handlePrintClick}>Печать для склада</span>
    </>
  );
};

export const PrintMscButton = ({
  actMscData,
}: {
  actMscData: MscActType[];
}) => {
  const handlePrintClick = () => {
    const compiledTemplate = Handlebars.compile(mscBodyHtmlTemp);

    const printWindow = window.open("", "", "width=800,height=600");
    if (printWindow) {
      const htmlContent = compiledTemplate({ items: actMscData });
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
    <>
      <span onClick={handlePrintClick}>Задание на погрузку печать</span>
    </>
  );
};
