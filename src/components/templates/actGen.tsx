"use client";
import React from "react";
import Handlebars from "handlebars";
import { bodyHtmlTemp, stylesTemp } from "./act";
import { Button } from "@nextui-org/react";
import logo from "../../app/_imgs/logo.png";
import Image from "next/image";

const RenderPrintButton: React.FC = () => {
  const handlePrintClick = () => {
    const compiledTemplate = Handlebars.compile(bodyHtmlTemp);
    const data = {
      companyName: "Компания Иванов",
      cargoName: "Пример груза",
      placeCount: "5",
      transportCost: "10000 KZT",
      recipientName: "Иван Иванов",
      date: "09.09.2024",
      logo: "../../app/_imgs/logo.png",
    };
    const renderedHtml = compiledTemplate(data);

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
      <Button onClick={handlePrintClick}>Печать</Button>
      {/* <Image src={logo} alt="" width={156} height={120} /> */}
    </div>
  );
};

export default RenderPrintButton;
