const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const { logInfo } = require("../utils/logger");
const generateReport = require("../utils/generate-report");
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

  addOkLink(url, status, source) {
    this.report.ok.push({ url, status, source });
  }

  addBrokenLink(url, status, source) {
    this.report.broken.push({ url, status, source });
  }

  addFailedLink(url, message, source) {
    this.report.failed.push({ url, status: "error", message, source });
  }

  getReport() {
    return this.report;
  }

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