const axios = require("axios");
const configManager = require("../config/config-manager");

class HttpHandler {
  constructor() {
    this.config = configManager.getConfig();
  }

  async retryRequest(requestFn, retries = this.config.retryCount, delay = this.config.retryDelay) {
    let lastError;

    for (let attempt = 1; attempt <= retries + 1; attempt++) {
      try {
        return await requestFn();
      } catch (err) {
        lastError = err;
        if (attempt <= retries) {
          await new Promise(res => setTimeout(res, delay));
        }
      }
    }

    throw lastError;
  }

  async makeRequest(url, method = 'get') {
    const requestFn = () => axios[method](url, {
      timeout: this.config.timeout,
      headers: { "User-Agent": this.config.userAgent },
      validateStatus: null
    });

    return this.retryRequest(requestFn);
  }

  async checkLink(url) {
    return this.makeRequest(url, 'head');
  }
}

module.exports = new HttpHandler(); 