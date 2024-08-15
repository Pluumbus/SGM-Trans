"use client";
import React from "react";
import Handlebars from "handlebars";
import { bodyHtmlTemp, stylesTemp } from "./templates/act";
// import template from "./templates/act";

const RenderPrintButton: React.FC = () => {
  const handlePrintClick = () => {
    const compiledTemplate = Handlebars.compile(bodyHtmlTemp);
    const data = {
      companyName: "Компания Иванов",
      cargoName: "Пример груза",
      placeCount: "5",
      transportCost: "10000 KZT",
      recipientName: "Иван Иванов",
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
      <button onClick={handlePrintClick}>Печать</button>
      {/* <button onClick={handleRenderClick}>Предпросмотр талона</button>
      {html && (
        <div>
          <div id="printable" dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      )} */}
    </div>
  );
};

export default RenderPrintButton;
