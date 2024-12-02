export const formatDate = (isoString: string) => {
  return isoString.split("T")[0];
};
