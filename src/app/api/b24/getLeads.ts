import { LeadType } from "../types";
// export const fetchBitrixLeads = async () => {
//   // URL входящего вебхука
//   const url =
//     "https://sgmtrans.bitrix24.kz/rest/1/1smy4e989bi5gvyu/crm.lead.fields.json";

//   let allLeads: any[] = []; // Массив для всех лидов
//   let start = 0; // Начальная позиция

//   try {
//     while (true) {
//       // Формируем URL с параметрами
//       const response = await fetch(`${url}?start=${start}`, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ select: ["*", "UF_*"] }),
//       });

//       if (!response.ok) {
//         throw new Error(`Ошибка: ${response.status} ${response.statusText}`);
//       }

//       const data = await response.json();

//       allLeads = [...allLeads, ...data.result];

//       if (!data.next) break;

//       start = data.next; // Обновляем стартовую позицию
//     }

//     return allLeads; // Возвращаем все лиды
//   } catch (error) {
//     console.error("Ошибка при запросе к Bitrix24 API:", error.message);
//     throw error; // Выбрасываем ошибку
//   }
// };
// export const fetchBitrixLeads = async () => {
//   const url =
//     "https://sgmtrans.bitrix24.kz/rest/1/3c4cwbytj70532k8/crm.lead.list.json";
//   let allLeads: any[] = [];
//   let start = 0;
//   try {
//     while (true) {
//       const response = await fetch(`${url}`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Accept: "application/json",
//         },
//         body: JSON.stringify({
//           select: [
//             "ID",
//             "PHONE",
//             "EMAIL",
//             "NAME",
//             "TITLE",
//             "DATE_CREATE",
//             "STATUS_ID",
//           ],
//           // start: ,
//           filter: { "!STATUS_ID": "JUNK" },
//           order: {
//             STATUS_ID: "ASC",
//           },
//         }),
//       });

//       if (!response.ok) {
//         throw new Error(`Ошибка: ${response.status} ${response.statusText}`);
//       }

//       const data = await response.json();

//       allLeads = [...allLeads, ...data.result];

//       if (!data.next) break;

//       start = data.next;
//     }

//     // Фильтруем лиды с телефонами
//     // const leadsWithPhones = allLeads.filter(
//     //   (lead) => lead.HAS_PHONE === "Y" && lead.PHONE?.length > 0
//     // );
//     const transformedLeads: LeadType[] = allLeads.map((lead) => ({
//       id: lead.ID,
//       name: lead.NAME || "Отсутствует",
//       date_create: lead.DATE_CREATE,
//       title: lead.TITLE || "Отсутствует",
//       status_id: lead.STATUS_ID || "Отсутствует",
//       phone: lead.PHONE && {
//         id: lead?.PHONE[0].ID,
//         value: lead?.PHONE[0].VALUE,
//         value_type: lead?.PHONE[0].VALUE_TYPE,
//         type_id: lead?.PHONE[0].TYPE_ID,
//       },
//       email: lead.EMAIL && {
//         id: lead?.EMAIL[0].ID,
//         value: lead?.EMAIL[0].VALUE,
//         value_type: lead?.EMAIL[0].VALUE_TYPE,
//         type_id: lead?.EMAIL[0].TYPE_ID,
//       },
//     }));

//     return transformedLeads;
//   } catch (error) {
//     console.error("Ошибка при запросе к Bitrix24 API:", error.message);
//     throw error;
//   }
// };

export const fetchBitrixLeads = async () => {
  const url =
    "https://sgmtrans.bitrix24.kz/rest/1/3c4cwbytj70532k8/crm.lead.list.json";

  try {
    // while (true) {
    const response = await fetch(`${url}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        select: [
          "ID",
          "PHONE",
          "EMAIL",
          "NAME",
          "TITLE",
          "DATE_CREATE",
          "STATUS_ID",
        ],
        // start: ,
        filter: { "!STATUS_ID": "JUNK" },
        order: {
          STATUS_ID: "ASC",
          DATE_CREATE: "DESC",
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Ошибка: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // allLeads = [...allLeads, ...data.result];

    // if (!data.next) break;

    // start = data.next;
    // }

    // Фильтруем лиды с телефонами
    // const leadsWithPhones = allLeads.filter(
    //   (lead) => lead.HAS_PHONE === "Y" && lead.PHONE?.length > 0
    // );
    const transformedLeads: LeadType[] = data.result.map((lead) => ({
      id: lead.ID,
      name: lead.NAME || "Отсутствует",
      date_create: lead.DATE_CREATE,
      title: lead.TITLE || "Отсутствует",
      status_id: lead.STATUS_ID || "Отсутствует",
      phone: lead.PHONE && {
        id: lead?.PHONE[0].ID,
        value: lead?.PHONE[0].VALUE,
        value_type: lead?.PHONE[0].VALUE_TYPE,
        type_id: lead?.PHONE[0].TYPE_ID,
      },
      email: lead.EMAIL && {
        id: lead?.EMAIL[0].ID,
        value: lead?.EMAIL[0].VALUE,
        value_type: lead?.EMAIL[0].VALUE_TYPE,
        type_id: lead?.EMAIL[0].TYPE_ID,
      },
    }));

    return transformedLeads;
  } catch (error) {
    console.error("Ошибка при запросе к Bitrix24 API:", error.message);
    throw error;
  }
};
