/**
 * Handles HTTP requests with retry logic and timeout configuration
 * @class HttpHandler
 */
const axios = require("axios");
const configManager = require("../config/config-manager");

class HttpHandler {
  constructor() {
    this.config = configManager.getConfig();
  }

  /**
   * Retries a failed request according to configured retry settings
   * @param {Function} requestFn - The function that makes the HTTP request
   * @param {number} retries - Number of retry attempts
   * @param {number} delay - Delay between retries in milliseconds
   * @returns {Promise<any>} The response from the successful request
   * @throws {Error} The last error if all retries fail
   */
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

  /**
   * Makes an HTTP request with configured timeout and user agent
   * @param {string} url - The URL to request
   * @param {string} method - The HTTP method to use
   * @returns {Promise<any>} The response from the request
   */
  async makeRequest(url, method = 'get') {
    const requestFn = () => axios[method](url, {
      timeout: this.config.timeout,
      headers: { "User-Agent": this.config.userAgent },
      validateStatus: null
    });

    return this.retryRequest(requestFn);
  }

  /**
   * Checks a link using HEAD request to verify its status
   * @param {string} url - The URL to check
   * @returns {Promise<any>} The response from the HEAD request
   */
  async checkLink(url) {
    return this.makeRequest(url, 'head');
  }
}

module.exports = new HttpHandler(); 