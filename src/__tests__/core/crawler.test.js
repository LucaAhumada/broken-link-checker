const crawler = require('../../core/crawler');
const httpHandler = require('../../core/http-handler');
const urlHandler = require('../../core/url-handler');
const reportManager = require('../../core/report-manager');
const configManager = require('../../config/config-manager');
const fs = require('fs');
const path = require('path');

// Read config before setting up mocks
const configPath = path.join(__dirname, '../../config/config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

// Mock dependencies
jest.mock('../../core/http-handler');
jest.mock('../../core/url-handler');
jest.mock('../../core/report-manager');
jest.mock('../../config/config-manager', () => ({
  getConfig: jest.fn().mockReturnValue({
    startUrl: 'https://demo.testfire.net',
    maxDepth: 2,
    timeout: 10000,
    followRedirects: true,
    checkExternalLinks: false,
    userAgent: 'BrokenLinksCrawler/1.0',
    excludePatterns: ['mailto:', 'tel:', 'javascript:', '#'],
    outputFile: 'reports/crawl-report.html',
    retryCount: 2,
    retryDelay: 1000
  })
}));
jest.mock('../../utils/logger', () => ({
  logInfo: jest.fn(),
  logBroken: jest.fn(),
  logOk: jest.fn(),
  logFailed: jest.fn(),
  logSummary: jest.fn()
}));

describe('Crawler', () => {
  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    
    // Reset crawler state
    crawler.visitedPages = new Map();
    crawler.checkedLinks = new Set();
    
    // Setup default mock implementations
    httpHandler.checkLink.mockResolvedValue({ status: 200 });
    httpHandler.makeRequest.mockResolvedValue({ data: '<html><a href="/test">Test</a></html>' });
    urlHandler.normalizeUrl.mockImplementation((link, base) => `${configManager.getConfig().startUrl}${link}`);
    urlHandler.shouldExclude.mockReturnValue(false);
    urlHandler.isInternal.mockReturnValue(true);
  });

  afterEach(() => {
    // Clean up crawler state
    crawler.visitedPages.clear();
    crawler.checkedLinks.clear();
  });

  describe('checkLink', () => {
    it('should log and report broken links (status >= 400)', async () => {
      httpHandler.checkLink.mockResolvedValueOnce({ status: 404 });
      
      await crawler.checkLink(`${configManager.getConfig().startUrl}/broken`, configManager.getConfig().startUrl);
      
      expect(reportManager.addBrokenLink).toHaveBeenCalledWith(
        `${configManager.getConfig().startUrl}/broken`,
        404,
        configManager.getConfig().startUrl,
        expect.any(Number)
      );
    });

    it('should log and report successful links (status < 400)', async () => {
      await crawler.checkLink(`${configManager.getConfig().startUrl}/ok`, configManager.getConfig().startUrl);
      
      expect(reportManager.addOkLink).toHaveBeenCalledWith(
        `${configManager.getConfig().startUrl}/ok`,
        200,
        configManager.getConfig().startUrl,
        expect.any(Number)
      );
    });

    it('should handle and report failed requests', async () => {
      httpHandler.checkLink.mockRejectedValueOnce(new Error('Connection failed'));
      
      await crawler.checkLink(`${configManager.getConfig().startUrl}/failed`, configManager.getConfig().startUrl);
      
      expect(reportManager.addFailedLink).toHaveBeenCalledWith(
        `${configManager.getConfig().startUrl}/failed`,
        'Connection failed',
        configManager.getConfig().startUrl,
        expect.any(Number)
      );
    });
  });

  describe('crawl', () => {
    it('should not crawl beyond max depth', async () => {
      const config = configManager.getConfig();
      crawler.config = config;
      
      await crawler.crawl(config.startUrl, config.maxDepth + 1);
      
      expect(httpHandler.makeRequest).not.toHaveBeenCalled();
    });

    it('should not revisit pages at same or greater depth', async () => {
      crawler.visitedPages.set(configManager.getConfig().startUrl, 1);
      
      await crawler.crawl(configManager.getConfig().startUrl, 2);
      
      expect(httpHandler.makeRequest).not.toHaveBeenCalled();
    });

    it('should crawl internal links recursively', async () => {
      // Mock the initial page and its two internal links
      httpHandler.makeRequest
        .mockResolvedValueOnce({ 
          data: '<html><a href="/page1">Page 1</a><a href="/page2">Page 2</a></html>' 
        })
        .mockResolvedValueOnce({ 
          data: '<html><a href="/page1">Page 1</a></html>' 
        })
        .mockResolvedValueOnce({ 
          data: '<html><a href="/page2">Page 2</a></html>' 
        });
      
      await crawler.crawl(configManager.getConfig().startUrl);
      
      expect(httpHandler.makeRequest).toHaveBeenCalledTimes(3); // Initial + 2 internal pages
    });

    it('should handle failed page requests gracefully', async () => {
      const error = new Error('Failed to fetch');
      httpHandler.makeRequest.mockRejectedValueOnce(error);
      
      await expect(crawler.crawl(configManager.getConfig().startUrl)).rejects.toThrow('Failed to fetch');
      
      expect(reportManager.addFailedLink).toHaveBeenCalledWith(
        configManager.getConfig().startUrl,
        error.message,
        'root',
        expect.any(Number)
      );
    });
  });

  describe('start', () => {
    it('should start crawling from the configured URL', async () => {
      const config = configManager.getConfig();
      crawler.config = config;
      
      await crawler.start();
      
      expect(httpHandler.makeRequest).toHaveBeenCalledWith(config.startUrl);
    });

    it('should handle errors during crawling', async () => {
      const error = new Error('Crawl failed');
      httpHandler.makeRequest.mockRejectedValueOnce(error);
      
      await expect(crawler.start()).rejects.toThrow('Crawl failed');
      expect(reportManager.saveReport).toHaveBeenCalled();
    });
  });
}); 