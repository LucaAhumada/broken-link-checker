/**
 * Handles URL normalization, validation, and internal/external link detection
 * @class UrlHandler
 */
const { URL } = require("url");
const configManager = require("../config/config-manager");

class UrlHandler {
  constructor() {
    this.config = configManager.getConfig();
  }

  /**
   * Normalizes a URL by resolving it against a base URL if necessary
   * @param {string} link - The URL to normalize
   * @param {string} base - The base URL to resolve against
   * @returns {string|null} The normalized URL or null if invalid
   */
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

  /**
   * Checks if a URL should be excluded based on configured patterns
   * @param {string} link - The URL to check
   * @returns {boolean} True if the URL should be excluded
   */
  shouldExclude(link) {
    return this.config.excludePatterns.some(pattern => link.includes(pattern));
  }

  /**
   * Determines if a URL is internal to the target website
   * @param {string} url - The URL to check
   * @returns {boolean} True if the URL is internal
   */
  isInternal(url) {
    const urlObj = new URL(url);
    const startUrlObj = new URL(this.config.startUrl);
    return urlObj.protocol === startUrlObj.protocol && 
           urlObj.hostname === startUrlObj.hostname;
  }
}

module.exports = new UrlHandler(); 