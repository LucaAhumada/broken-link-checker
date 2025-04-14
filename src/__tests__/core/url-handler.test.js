const urlHandler = require('../../core/url-handler');
const configManager = require('../../config/config-manager');

describe('UrlHandler', () => {
  beforeEach(() => {
    // Reset the singleton's config
    urlHandler.config = configManager.getConfig();
  });

  describe('normalizeUrl', () => {
    it('should normalize relative URLs with base URL', () => {
      const result = urlHandler.normalizeUrl('/test', urlHandler.config.startUrl);
      expect(result).toBe(`${urlHandler.config.startUrl}/test`);
    });

    it('should return absolute URLs unchanged', () => {
      const result = urlHandler.normalizeUrl(urlHandler.config.startUrl + '/test', urlHandler.config.startUrl);
      expect(result).toBe(`${urlHandler.config.startUrl}/test`);
    });

    it('should handle protocol-relative URLs', () => {
      const result = urlHandler.normalizeUrl('//demo.testfire.net/test', urlHandler.config.startUrl);
      expect(result).toBe('https://demo.testfire.net/test');
    });

    it('should return null for invalid URLs', () => {
      const result = urlHandler.normalizeUrl('invalid-url', urlHandler.config.startUrl);
      expect(result).toBeNull();
    });
  });

  describe('shouldExclude', () => {
    it('should exclude URLs matching patterns', () => {
      expect(urlHandler.shouldExclude('mailto:test@example.com')).toBe(true);
      expect(urlHandler.shouldExclude('tel:+1234567890')).toBe(true);
      expect(urlHandler.shouldExclude('javascript:void(0)')).toBe(true);
      expect(urlHandler.shouldExclude('#section')).toBe(true);
    });

    it('should not exclude URLs not matching patterns', () => {
      expect(urlHandler.shouldExclude('https://demo.testfire.net/valid/page')).toBe(false);
    });
  });

  describe('isInternal', () => {
    it('should identify internal URLs', () => {
      expect(urlHandler.isInternal('https://demo.testfire.net/page')).toBe(true);
      expect(urlHandler.isInternal('https://demo.testfire.net:8080/page')).toBe(true);
    });

    it('should identify external URLs', () => {
      expect(urlHandler.isInternal('https://other.com/page')).toBe(false);
      expect(urlHandler.isInternal('http://demo.testfire.net/page')).toBe(false);
    });

    it('should handle invalid URLs', () => {
      expect(() => urlHandler.isInternal('invalid-url')).toThrow();
    });
  });
}); 