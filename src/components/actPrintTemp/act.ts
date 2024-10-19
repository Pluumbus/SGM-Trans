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
.act-bottom {
display:flex;
justify-content: space-between;
}
`;

export const bodyHtmlTemp = ` <div class="container">
        <header>
            <div class="company-info">
                <b>ТОО «SGM - Trans»</b>
                <p>г. Нур-Султан, ул. Пушкина, 39</p>
                <p>тел.: 8 (7172) 48-43-41</p>
                <p><a href="http://www.sgm-trans.com/">www.sgm-trans.com</a></p>

                <img src="{{logo}}">

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
                    <td>{{ client_bin}} </td>
                    <td>{{ cargo_name }}</td>
                    <td>{{ quantity }}</td>
                    <td>{{ amount }}</td>
                   
                    <td></td>
                </tr>
            </table>
            <div class="act-bottom">
            <b>Дата: {{ date }}</b>
            <b>Cклад №2</b>
            </div>
        </section>
    </div>`;

