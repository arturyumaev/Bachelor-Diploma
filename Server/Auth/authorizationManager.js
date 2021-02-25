const StorageInterface = require("../Storage/storageInterface");

module.exports = authorizationManager = async (request) => {
  const username = request.body.username;
  const password = request.body.password;
  const storageInterface = new StorageInterface();
  
  const result = await storageInterface.authorize(username);
  console.log(result);
  return Object(result);
};
