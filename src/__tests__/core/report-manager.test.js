const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Mock dependencies first
jest.mock('fs');
jest.mock('child_process');
jest.mock('../../utils/logger', () => ({
  logInfo: jest.fn()
}));

// Mock generate-report module
jest.mock('../../utils/generate-report', () => {
  return jest.fn().mockReturnValue('Mock report content');
});

// Mock config manager before requiring report manager
jest.mock('../../config/config-manager', () => {
  return {
    getConfig: jest.fn().mockReturnValue({
      outputFile: '/path/to/report.html'
    })
  };
});

const reportManager = require('../../core/report-manager');
const generateReport = require('../../utils/generate-report');

describe('ReportManager', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock fs.readFileSync to return the config JSON
    fs.readFileSync.mockImplementation((filePath) => {
      if (filePath.includes('config.json')) {
        return JSON.stringify({
          startUrl: "https://demo.testfire.net",
          maxDepth: 2,
          timeout: 10000,
          followRedirects: true,
          checkExternalLinks: false,
          userAgent: "BrokenLinksCrawler/1.0",
          excludePatterns: ["mailto:", "tel:", "javascript:", "#"],
          outputFile: "reports/crawl-report.html",
          retryCount: 2,
          retryDelay: 1000
        });
      }
      return '';
    });
    // Reset the singleton's state
    reportManager.config = {
      outputFile: '/path/to/report.html'
    };
    reportManager.report = {
      ok: [],
      broken: [],
      failed: []
    };
  });

  describe('addLink methods', () => {
    it('should add OK links to report', () => {
      reportManager.addOkLink('https://example.com', 200, 'https://example.com', 100);
      
      expect(reportManager.report.ok).toContainEqual({
        url: 'https://example.com',
        status: 200,
        source: 'https://example.com',
        duration: 100
      });
    });

    it('should add broken links to report', () => {
      reportManager.addBrokenLink('https://example.com', 404, 'https://example.com', 100);
      
      expect(reportManager.report.broken).toContainEqual({
        url: 'https://example.com',
        status: 404,
        source: 'https://example.com',
        duration: 100
      });
    });

    it('should add failed links to report', () => {
      reportManager.addFailedLink('https://example.com', 'Connection failed', 'https://example.com', 100);
      
      expect(reportManager.report.failed).toContainEqual({
        url: 'https://example.com',
        status: 'error',
        message: 'Connection failed',
        source: 'https://example.com',
        duration: 100
      });
    });
  });

  describe('getReport', () => {
    it('should return the current report', () => {
      const report = reportManager.getReport();
      
      expect(report).toEqual({
        ok: [],
        broken: [],
        failed: []
      });
    });
  });

  describe('saveReport', () => {
    it('should create directory if it doesn\'t exist', () => {
      fs.existsSync.mockReturnValue(false);
      
      reportManager.saveReport();
      
      expect(fs.mkdirSync).toHaveBeenCalledWith('/path/to', { recursive: true });
    });

    it('should write report to file', () => {
      reportManager.saveReport();
      
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        '/path/to/report.html',
        'Mock report content'
      );
    });

    it('should open report after saving', () => {
      reportManager.saveReport();
      
      expect(exec).toHaveBeenCalled();
    });

    it('should handle write errors', () => {
      fs.writeFileSync.mockImplementation(() => {
        throw new Error('Write failed');
      });
      
      reportManager.saveReport();
      
      expect(exec).not.toHaveBeenCalled();
    });
  });

  describe('openReport', () => {
    it('should use correct command for macOS', () => {
      Object.defineProperty(process, 'platform', { value: 'darwin' });
      
      reportManager.openReport('/path/to/report.html');
      
      expect(exec).toHaveBeenCalledWith('open "/path/to/report.html"', expect.any(Function));
    });

    it('should use correct command for Windows', () => {
      Object.defineProperty(process, 'platform', { value: 'win32' });
      
      reportManager.openReport('/path/to/report.html');
      
      expect(exec).toHaveBeenCalledWith('start "" "/path/to/report.html"', expect.any(Function));
    });

    it('should use correct command for Linux', () => {
      Object.defineProperty(process, 'platform', { value: 'linux' });
      
      reportManager.openReport('/path/to/report.html');
      
      expect(exec).toHaveBeenCalledWith('xdg-open "/path/to/report.html"', expect.any(Function));
    });
  });
}); 