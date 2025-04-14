const fs = require('fs');
const path = require('path');
const configManager = require('../../config/config-manager');
const configSchema = require('../../config/config.schema');
const z = require('zod');

// Mock dependencies
jest.mock('fs');
jest.mock('../../config/config.schema');

// Mock console.error
global.console.error = jest.fn();

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

    it('should handle Zod validation errors with detailed messages', () => {
      const invalidConfig = {
        startUrl: 'not-a-url',
        maxDepth: 'not-a-number'
      };
      
      const mockZodError = new z.ZodError([
        { path: ['startUrl'], message: 'Invalid URL' },
        { path: ['maxDepth'], message: 'Expected number' }
      ]);
      
      // Mock fs.readFileSync to return valid JSON
      fs.readFileSync.mockReturnValue(JSON.stringify(invalidConfig));
      
      // Mock configSchema.parse to throw Zod error
      configSchema.parse.mockImplementation(() => {
        throw mockZodError;
      });
      
      expect(() => configManager.load()).toThrow('Invalid configuration');
      expect(console.error).toHaveBeenCalledWith('Configuration validation failed:');
      expect(console.error).toHaveBeenCalledWith('- startUrl: Invalid URL');
      expect(console.error).toHaveBeenCalledWith('- maxDepth: Expected number');
    });

    it('should rethrow non-Zod errors', () => {
      const error = new Error('Unexpected error');
      
      // Mock fs.readFileSync to return valid JSON
      fs.readFileSync.mockReturnValue(JSON.stringify({ startUrl: 'https://test.com' }));
      
      // Mock configSchema.parse to throw non-Zod error
      configSchema.parse.mockImplementation(() => {
        throw error;
      });
      
      expect(() => configManager.load()).toThrow('Unexpected error');
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