const fetch = require("node-fetch");
const readConfigFile = require("read-config-file");
const path = require('path');

module.exports = class EmailService {
  constructor() {
    this.config = {};

    readConfigFile.loadConfig({
      packageKey: '1',
      configFilename: 'application.local',
      projectDir: path.resolve(__dirname)
    }).then((jsonCfg) => {
      this.config = jsonCfg.result;
    });
  }

  sendAccessData(name, username, password) {
    const templateParams = {
      'to_name': name,
      'message': `Username: ${username} Password: ${password}`,
      'link_name': 'http://mcs.ru',
      'from_name': 'Administrator',
    };

    return fetch(this.config.apiPath,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Accept': '*/*',
        },
        body: JSON.stringify({
          'template_id': this.config.template_id,
          'service_id': this.config.service_id,
          'user_id': this.config.user_id,
          'template_params': templateParams,
          'accessToken': this.config.accessToken,
        })
      }
    );
  }
}