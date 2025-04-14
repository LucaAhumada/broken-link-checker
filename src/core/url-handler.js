const { URL } = require("url");
const configManager = require("../config/config-manager");

class UrlHandler {
  constructor() {
    this.config = configManager.getConfig();
  }

  normalizeUrl(link, base) {
    // First check if the link is empty or contains invalid characters
    if (!link || /[\s<>]/.test(link)) {
      return null;
    }

    try {
      // First try to parse the link as is
      const url = new URL(link);
      return url.href;
    } catch {
      try {
        // If that fails, try with the base URL
        // But first check if the link starts with a valid path character
        if (!link.startsWith('/') && !link.startsWith('./') && !link.startsWith('../')) {
          return null;
        }
        const url = new URL(link, base);
        return url.href;
      } catch {
        return null;
      }
    }
  }

  shouldExclude(link) {
    return this.config.excludePatterns.some(pattern => link.includes(pattern));
  }

  isInternal(url) {
    const urlObj = new URL(url);
    const startUrlObj = new URL(this.config.startUrl);
    return urlObj.protocol === startUrlObj.protocol && 
           urlObj.hostname === startUrlObj.hostname;
  }
}

module.exports = new UrlHandler(); 