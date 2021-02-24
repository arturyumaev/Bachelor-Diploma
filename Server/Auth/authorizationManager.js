const StorageInterface = require("../Storage/storageInterface");

module.exports = authorizationManager = async (request) => {
  const username = request.body.username;
  const password = request.body.password;
  const storageInterface = new StorageInterface();
  
  return storageInterface
    .authorize(username)
    .then(res => { console.log(res); return res; })
    .then(res => Object(res));
};
