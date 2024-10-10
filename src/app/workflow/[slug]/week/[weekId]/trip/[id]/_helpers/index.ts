export const getDayOfWeek = (dateStr) => {
    const [day, month, year] = dateStr.split(".").map(Number);
    const date = new Date(year, month - 1, day);
    const dayIndex = date.getDay();
    const daysOfWeek = ["ВС", "ПН", "ВТ", "СР", "ЧТ", "ПН", "СБ"];
    return daysOfWeek[dayIndex];
  };
