const { logInfo } = require("./utils/logger");
const crawler = require("./core/crawler");
const reportManager = require("./core/report-manager");

// Handle process termination
process.on('SIGINT', () => {
  logInfo('\nScan interrupted. Generating partial report...');
  reportManager.saveReport();
  process.exit(0);
});

process.on('SIGTERM', () => {
  logInfo('\nScan terminated. Generating partial report...');
  reportManager.saveReport();
  process.exit(0);
});

process.on('uncaughtException', (error) => {
  logInfo(`\nUnexpected error: ${error.message}`);
  logInfo('Generating partial report...');
  reportManager.saveReport();
  process.exit(1);
});

// Start the crawler
crawler.start(); 