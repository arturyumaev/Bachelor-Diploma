const generateNRandomNumbers = N => {
  var arr = [];
  while (arr.length < N) {
    var r = Math.floor(Math.random() * 100) + 1;
    (arr.indexOf(r) === -1) && arr.push(r);
  }

  return arr;
};

const generatePassword = () => {
  var length = 8,
      charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
      retVal = "";
  for (var i = 0, n = charset.length; i < length; ++i) {
      retVal += charset.charAt(Math.floor(Math.random() * n));
  }
  return retVal;
}

module.exports = {
  generateNRandomNumbers,
  generatePassword,
}