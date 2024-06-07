export const formatUrlPath = (path) => {
  // Trim leading and trailing slashes from the path
  if (typeof path !== "string") return "";
  return path.replace(/^\//, "").replace(/\/$/, "");
};
