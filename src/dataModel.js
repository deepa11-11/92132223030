export const saveToStorage = (shortcode, urlObj) => {
  const data = JSON.parse(localStorage.getItem("shortLinks") || "{}");
  data[shortcode] = urlObj;
  localStorage.setItem("shortLinks", JSON.stringify(data));
};

export const getFromStorage = (shortcode) => {
  const data = JSON.parse(localStorage.getItem("shortLinks") || "{}");
  return data[shortcode];
};

export const isShortcodeTaken = (code) => {
  const data = JSON.parse(localStorage.getItem("shortLinks") || "{}");
  return data.hasOwnProperty(code);
};
