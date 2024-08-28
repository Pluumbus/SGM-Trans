import logo from "../../app/_imgs/logo.png";

export const stylesTemp = `body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
    background-color: #f4f4f4;
}

.container {
    width: 100%;
    margin: 0 auto;
    background-color: #fff;
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
}

header, section {
    margin-bottom: 20px;
}

header .company-info, section.recipient-info, section.cargo-info {
    border: 1px solid #ddd;
    padding: 10px;
    border-radius: 5px;
    background-color: #f9f9f9;
}

header .company-info p, section.recipient-info p, section.cargo-info p {
    margin: 5px 0;
}

header .company-info p a {
    color: #333;
    text-decoration: none;
}

header .company-info p a:hover {
    text-decoration: underline;
}

section.recipient-info h2, section.cargo-info h2 {
    margin-top: 0;
    text-align: center;
}

section.cargo-info table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 10px;
}

section.cargo-info table, section.cargo-info table th, section.cargo-info table td {
    border: 1px solid #ddd;
}

section.cargo-info table th, section.cargo-info table td {
    padding: 8px;
    text-align: left;
}
`;
//  `<style>
//         body {
//             font-family: Arial, sans-serif;
//             line-height: 1.6;
//         }
//         .container {
//             width: 80%;
//             margin: 0 auto;
//             padding: 20px;
//             border: 1px solid #000;
//         }
//         .header, .footer {
//             text-align: center;
//         }
//         .header p, .footer p {
//             margin: 5px 0;
//         }
//         .content {
//             margin-top: 20px;
//         }
//         .content table {
//             width: 100%;
//             border-collapse: collapse;
//         }
//         .content th, .content td {
//             border: 1px solid #000;
//             padding: 8px;
//             text-align: left;
//         }
//         .content th {
//             background-color: #f2f2f2;
//         }
//         .signature {
//             margin-top: 20px;
//         }
//         .signature div {
//             margin-bottom: 20px;
//         }
//         .signature span {
//             display: inline-block;
//             width: 200px;
//             border-bottom: 1px solid #000;
//         }
//     </style>`;
export const bodyHtmlTemp = ` <div class="container">
        <header>
            <div class="company-info">
                <p>ТОО «SGM - Trans»</p>
                <p>г. Нур-Султан, ул. Пушкина, 39</p>
                <p>тел.: 8 (7172) 48-43-41</p>
                <p>e-mail: admin@sgm-trans.com</p>
                <p><a href="http://www.sgm-trans.com/">www.sgm-trans.com</a></p>
            </div>
            <div>
            ${logo}
            <img src="${logo}"/>
            </div>
        </header>



        <section class="cargo-info">
            <h2>АКТ ПРИЕМА-ПЕРЕДАЧИ ГРУЗА</h2>
            <table>
                <tr>
                <th>Компания-получатель</th>
                    <th>Наименование груза</th>
                    <th>Количество мест</th>
                    <th>Стоимость перевозки</th>
                    <th>ФИО получателя</th>
                    <th>Подпись получателя</th>
                </tr>
                <tr>
                    <td>{{ companyName}} </td>
                    <td>{{ cargoName }}</td>
                    <td>{{ placeCount }}</td>
                    <td>{{ transportCost }}</td>
                    <td>{{ recipientName }}</td>
                    <td>Подпись</td>
                </tr>
            </table>
            <p>Cклад №2</p>
        </section>
    </div>`;
// `<div class="container">
//   <div class="header">
//     <p>ТОО «SGM - Trans»</p>
//     <p>г. Нур-Султан, ул. Пушкина, 39</p>
//     <p>тел.: 8 (7172) 48-43-41</p>
//     <p>skype: perevozchik-sgm</p>
//     <p>e-mail: admin@sgm-trans.kz</p>
//     <p>www.sgm-trans.kz</p>
//   </div>

//   <div class="content">
//     <h2>АКТ ПРИЕМА-ПЕРЕДАЧИ ГРУЗА</h2>
//     <table>
//       <tr>
//         <th>Наименование груза</th>
//         <td>{{ cargoName }}</td>
//       </tr>
//       <tr>
//         <th>Количество мест</th>
//         <td>{{ placeCount }}</td>
//       </tr>
//       <tr>
//         <th>Стоимость перевозки</th>
//         <td>{{ transportCost }}</td>
//       </tr>
//       <tr>
//         <th>ФИО получателя</th>
//         <td>{{ recipientName }}</td>
//       </tr>
//     </table>
//   </div>

//   <div class="signature">
//     <div>
//       <p>Компания-получатель</p>
//       <p>
//         Подпись получателя: <span>{{ recipientSignature }}</span>
//       </p>
//     </div>
//     <div class="footer">
//       <p>ТОО «SGM - Trans»</p>
//       <p>г. Нур-Султан, ул. Пушкина, 39</p>
//       <p>тел.: 8 (7172) 48-43-41</p>
//       <p>skype: perevozchik-sgm</p>
//       <p>e-mail: admin@sgm-trans.kz</p>
//       <p>www.sgm-trans.kz</p>
//     </div>
//   </div>
// </div>`;
