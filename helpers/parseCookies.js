module.exports.parseCookies = (cookieString) => {
  if (!cookieString) return {};
  return cookieString.split(';').reduce((res, item) => {
    const parts = item.split('=');
    res[parts[0].trim()] = parts[1].trim();
    return res;
  }, {});
};