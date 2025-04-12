const { URL } = require("url");
const configManager = require("../config/config-manager");

class UrlHandler {
  constructor() {
    this.config = configManager.getConfig();
  }

  normalizeUrl(link, base) {
    try {
      return new URL(link, base).href;
    } catch {
      return null;
    }
  }

  shouldExclude(link) {
    return this.config.excludePatterns.some(pattern => link.includes(pattern));
  }

  isInternal(url) {
    return new URL(url).hostname === new URL(this.config.startUrl).hostname;
  }
}

module.exports = new UrlHandler(); 