/**
 * Manages the generation and storage of link checking reports
 * @class ReportManager
 */
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const { logInfo } = require("../utils/logger");
const { generateReport } = require("../utils/generate-report");
const configManager = require("../config/config-manager");

class ReportManager {
  constructor() {
    this.config = configManager.getConfig();
    this.report = {
      ok: [],
      broken: [],
      failed: []
    };
  }

  /**
   * Adds a working link to the report
   * @param {string} url - The URL that was checked
   * @param {number} status - The HTTP status code
   * @param {string} source - The page where the link was found
   * @param {number} duration - Time taken to check the link in milliseconds
   */
  addOkLink(url, status, source, duration) {
    this.report.ok.push({ url, status, source, duration });
  }

  /**
   * Adds a broken link to the report
   * @param {string} url - The URL that was checked
   * @param {number} status - The HTTP status code
   * @param {string} source - The page where the link was found
   * @param {number} duration - Time taken to check the link in milliseconds
   */
  addBrokenLink(url, status, source, duration) {
    this.report.broken.push({ url, status, source, duration });
  }

  /**
   * Adds a failed link check to the report
   * @param {string} url - The URL that was checked
   * @param {string} message - The error message
   * @param {string} source - The page where the link was found
   * @param {number} duration - Time taken to check the link in milliseconds
   */
  addFailedLink(url, message, source, duration) {
    this.report.failed.push({ url, status: "error", message, source, duration });
  }

  /**
   * Gets the current report
   * @returns {Object} The report object
   */
  getReport() {
    return this.report;
  }

  /**
   * Opens the report file using the system's default application
   * @param {string} filePath - Path to the report file
   */
  openReport(filePath) {
    const platform = process.platform;
    let command;

    switch (platform) {
      case 'darwin': // macOS
        command = `open "${filePath}"`;
        break;
      case 'win32': // Windows
        command = `start "" "${filePath}"`;
        break;
      default: // Linux and others
        command = `xdg-open "${filePath}"`;
    }

    exec(command, (error) => {
      if (error) {
        logInfo(`Failed to open report: ${error.message}`);
      }
    });
  }

  /**
   * Saves the report to a file and opens it
   */
  saveReport() {
    if (this.config.outputFile) {
      try {
        const reportDir = path.dirname(this.config.outputFile);
        if (!fs.existsSync(reportDir)) {
          fs.mkdirSync(reportDir, { recursive: true });
        }
        
        const reportContent = generateReport(this.report);
        fs.writeFileSync(this.config.outputFile, reportContent);
        logInfo(`Report saved to ${this.config.outputFile}`);
        
        this.openReport(this.config.outputFile);
      } catch (error) {
        logInfo(`Failed to save report: ${error.message}`);
      }
    }
  }
}

module.exports = new ReportManager(); 