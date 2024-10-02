"use client";
import React from "react";
import Handlebars from "handlebars";
import { bodyHtmlTemp, stylesTemp } from "./act";
import { Button } from "@nextui-org/react";

export type ActType = {
  client_bin: string;
  cargo_name: string;
  quantity: string;
  amount: string;
  date: string;
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
