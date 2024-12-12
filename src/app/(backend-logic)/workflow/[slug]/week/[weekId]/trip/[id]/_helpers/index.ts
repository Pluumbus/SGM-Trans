export const getDayOfWeek = (dateStr: string) => {
  const [day, month, year] = dateStr.split(".").map(Number);
  const date = new Date(year, month - 1, day);
  const dayIndex = date.getDay();
  return daysOfWeek[dayIndex];
};
export const daysOfWeek = ["ВС", "ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ"];
