export const formatDate = (isoString: string) => {
  return isoString.split("T")[0];
};

export const formatDateMonth = (dateString) => {
  if (!dateString) return "-";
  const months = [
    "января",
    "февраля",
    "марта",
    "апреля",
    "мая",
    "июня",
    "июля",
    "августа",
    "сентября",
    "октября",
    "ноября",
    "декабря",
  ];

  const date = new Date(dateString);
  const day = date.getDate();
  const month = months[date.getMonth()];

  return `${day} ${month}`;
};
