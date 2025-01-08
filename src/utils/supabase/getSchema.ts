export const getSchema = () => {
  if (typeof window !== "undefined") {
    return window.location.hostname === "localhost" ? "dev" : "public";
  }
  return process.env.NODE_ENV === "development" ? "dev" : "public";
};
