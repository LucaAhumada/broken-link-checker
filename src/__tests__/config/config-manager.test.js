const fs = require('fs');
const path = require('path');
const configManager = require('../../config/config-manager');
const configSchema = require('../../config/config.schema');

// Mock dependencies
jest.mock('fs');
jest.mock('../../config/config.schema');

describe('ConfigManager', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset the singleton's state
    configManager.config = null;
  });

  describe('load', () => {
    it('should load and validate configuration', () => {
      const mockConfig = {
        startUrl: 'https://demo.testfire.net',
        maxDepth: 2,
        timeout: 10000,
        followRedirects: true,
        checkExternalLinks: false,
        userAgent: 'BrokenLinksCrawler/1.0 (+https://github.com/LucaAhumada/broken-link-checker.git; bot@example.com)',
        excludePatterns: ['mailto:', 'tel:', 'javascript:', '#'],
        outputFile: 'reports/crawl-report.html',
        retryCount: 2,
        retryDelay: 1000
      };

      fs.readFileSync.mockReturnValue(JSON.stringify(mockConfig));
      configSchema.parse.mockReturnValue(mockConfig);

      const result = configManager.load();

      expect(fs.readFileSync).toHaveBeenCalledWith(
        expect.stringContaining('config.json'),
        'utf-8'
      );
      expect(configSchema.parse).toHaveBeenCalledWith(mockConfig);
      expect(result).toEqual(mockConfig);
    });

    it('should handle invalid configuration', () => {
      const mockConfig = {
        startUrl: 'invalid-url',
        maxDepth: -1
      };

      fs.readFileSync.mockReturnValue(JSON.stringify(mockConfig));
      configSchema.parse.mockImplementation(() => {
        throw new Error('Invalid configuration');
      });

      expect(() => configManager.load()).toThrow('Invalid configuration');
    });

    it('should handle file read errors', () => {
      fs.readFileSync.mockImplementation(() => {
        throw new Error('File not found');
      });

      expect(() => configManager.load()).toThrow('File not found');
    });
  });

  describe('getConfig', () => {
    it('should load config if not already loaded', () => {
      const mockConfig = {
        startUrl: 'https://demo.testfire.net',
        maxDepth: 2
      };

      fs.readFileSync.mockReturnValue(JSON.stringify(mockConfig));
      configSchema.parse.mockReturnValue(mockConfig);

      const result = configManager.getConfig();

      expect(result).toEqual(mockConfig);
      expect(fs.readFileSync).toHaveBeenCalled();
    });

    it('should return cached config if already loaded', () => {
      const mockConfig = {
        startUrl: 'https://demo.testfire.net',
        maxDepth: 2
      };

      configManager.config = mockConfig;

      const result = configManager.getConfig();

      expect(result).toEqual(mockConfig);
      expect(fs.readFileSync).not.toHaveBeenCalled();
    });
  });
}); 