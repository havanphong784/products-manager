const crypto = require('crypto');

module.exports.generateRandomString = (length) => {
  return crypto.randomBytes(Math.ceil(length * 3 / 4))
    .toString('base64url')
    .slice(0, length);
}

module.exports.generateRandomNumber = (length) => {
  const max = Math.pow(10, length);
  return String(crypto.randomInt(max)).padStart(length, '0');
}