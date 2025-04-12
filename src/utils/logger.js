const chalk = require("chalk").default;

const getDurationColor = (duration) => {
  if (duration <= 500) return chalk.green;
  if (duration <= 1500) return chalk.yellow;
  if (duration <= 3000) return chalk.hex('#FFA500'); // Orange
  return chalk.red;
};

module.exports = {
  logCrawling: (url, depth) => {
    console.log(chalk.blue(`🌐 [Depth ${depth}] Crawling: ${url}`));
  },

  logOk: (url, status, duration) => {
    const durationColor = getDurationColor(duration);
    console.log(chalk.green(`✅ [${status}] OK - ${url} (${durationColor(duration)}ms)`));
  },

  logBroken: (url, status, source, duration) => {
    const durationColor = getDurationColor(duration);
    console.log(chalk.red(`❌ [${status}] BROKEN - ${url} (${durationColor(duration)}ms) (found on ${source})`));
  },

  logFailed: (url, message, source, duration) => {
    const durationColor = getDurationColor(duration);
    console.log(chalk.yellow(`⚠️  FAILED - ${url} (${message}) (${durationColor(duration)}ms) (found on ${source})`));
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
