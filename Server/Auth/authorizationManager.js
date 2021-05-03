const StorageInterface = require("../Storage/storageInterface");
const storageInterface = require('../connection');

module.exports = authorizationManager = async (request) => {
  const username = request.body.username;
  const password = request.body.password;
  
  const result = await storageInterface.authorize(username);
  console.log(result);
  return Object(result);
};
