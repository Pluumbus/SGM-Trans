export const fetchBitrixLeads = async () => {
  // URL входящего вебхука
  const url =
    "https://sgmtrans.bitrix24.kz/rest/1/3c4cwbytj70532k8/crm.lead.list.json";

  try {
    // Выполняем GET-запрос к API Bitrix24
    const response = await fetch(`${url}?start=0`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Ошибка: ${response.status} ${response.statusText}`);
    }

    // Возвращаем данные в формате JSON
    const data = await response.json();
    return data.result; // Возвращаем массив данных из поля result
  } catch (error) {
    console.error("Ошибка при запросе к Bitrix24 API:", error.message);
    throw error; // Выбрасываем ошибку, чтобы обработать её в вызывающем коде
  }
};
