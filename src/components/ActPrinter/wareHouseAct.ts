export const wrhStylesTemp = `body {
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

section.cargo-info ul {
    list-style-type: none;
    padding: 0;
}

section.cargo-info ul li {
    padding: 8px;
    border-bottom: 1px solid #ddd;
}

section.cargo-info ul li:last-child {
    border-bottom: none;
}

li .label {
    font-weight: bold;
}

.act-bottom {
    display: flex;
    justify-content: space-between;
}
`;

export const wrhBodyHtmlTemp = `
    <div class="container">
        <section class="cargo-info">
            <table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse; width: 100%;">
                <thead>
                    <tr>
                        <th>Адрес разгрузки</th>
                        <th>Вес(тонн)</th>
                        <th>Объем(м.куб)</th>
                        <th>Кол-во</th>
                        <th>Распалечиваем</th>
                        <th>Доп.информация</th>
                        <th>Компания-получатель</th>
                        <th>Название груза</th>
                        <th>Плательщик</th>
                        <th>Менджер</th>
                    </tr>
                </thead>
                <tbody>
                    {{#each items}}
                        <tr>
                            <td>{{ unloading_point }}</td>
                            <td>{{ weight }}</td>
                            <td>{{ volume }}</td>
                            <td>{{ quantity }} - {{ quantity_type }} </td>
                            <td>{{ is_unpalletizing }}</td>
                            <td>{{ comments }}</td>
                            <td>{{ client_bin }}</td>
                            <td>{{ cargo_name }}</td>
                            <td>{{ transportation_manager }}</td>
                            <td>{{ sgm_manager }}</td>
                        </tr>
                    {{/each}}
                </tbody>
            </table>
        </section>
    </div>
`;
