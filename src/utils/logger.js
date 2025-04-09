const chalk = require("chalk").default;

module.exports = {
  logCrawling: (url, depth) => {
    console.log(chalk.blue(`🌐 [Depth ${depth}] Crawling: ${url}`));
  },

  logOk: (url, status) => {
    console.log(chalk.green(`✅ [${status}] OK - ${url}`));
  },

  logBroken: (url, status, source) => {
    console.log(chalk.red(`❌ [${status}] BROKEN - ${url} (found on ${source})`));
  },

  logFailed: (url, message, source) => {
    console.log(chalk.yellow(`⚠️  FAILED - ${url} (${message}) (found on ${source})`));
  },

  logInfo: (msg) => {
    console.log(chalk.cyan(`ℹ️  ${msg}`));
  },

  logSummary: (report) => {
    console.log("\n📊 Crawl Summary:");
    console.log(chalk.green(`✅ OK:     ${report.ok.length}`));
    console.log(chalk.red(`❌ Broken: ${report.broken.length}`));
    console.log(chalk.yellow(`⚠️  Failed: ${report.failed.length}`));
  }
};
