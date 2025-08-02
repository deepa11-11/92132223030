export const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

export const isValidShortcode = (code) => {
  return /^[a-zA-Z0-9]{4,10}$/.test(code);
};
