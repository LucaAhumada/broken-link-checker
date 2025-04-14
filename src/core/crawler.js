const cheerio = require("cheerio");
const { logInfo, logBroken, logOk, logFailed, logSummary } = require("../utils/logger");
const configManager = require("../config/config-manager");
const urlHandler = require("./url-handler");
const httpHandler = require("./http-handler");
const reportManager = require("./report-manager");

class Crawler {
  constructor() {
    this.config = configManager.getConfig();
    this.visitedPages = new Map();
    this.checkedLinks = new Set();
  }

  async checkLink(link, sourcePage) {
    const startTime = Date.now();
    try {
      const response = await httpHandler.checkLink(link);
      const status = response.status;
      const duration = Date.now() - startTime;

      if (status >= 400) {
        logBroken(link, status, sourcePage, duration);
        reportManager.addBrokenLink(link, status, sourcePage, duration);
      } else {
        logOk(link, status, duration);
        reportManager.addOkLink(link, status, sourcePage, duration);
      }
    } catch (err) {
      const duration = Date.now() - startTime;
      logFailed(link, err.message, sourcePage, duration);
      reportManager.addFailedLink(link, err.message, sourcePage, duration);
    }
  }

  async crawl(url, depth = 0) {
    const existingDepth = this.visitedPages.get(url);

    if (existingDepth !== undefined && depth >= existingDepth) return;
    if (depth > this.config.maxDepth) return;

    this.visitedPages.set(url, depth);

    let html;
    try {
      const res = await httpHandler.makeRequest(url);
      html = res.data;
    } catch (err) {
      logFailed(url, err.message, "root");
      return;
    }

    const $ = cheerio.load(html);
    const links = $("a")
      .map((_, el) => $(el).attr("href"))
      .get()
      .filter(Boolean);

    for (let link of links) {
      if (urlHandler.shouldExclude(link)) continue;

      const fullUrl = urlHandler.normalizeUrl(link, url);
      if (!fullUrl || this.checkedLinks.has(fullUrl)) continue;

      this.checkedLinks.add(fullUrl);

      const internal = urlHandler.isInternal(fullUrl);

      if (internal || this.config.checkExternalLinks) {
        await this.checkLink(fullUrl, url);
      }

      if (internal) {
        await this.crawl(fullUrl, depth + 1);
      }
    }
  }

  async start() {
    try {
      logInfo(`Starting crawl at: ${this.config.startUrl}`);
      await this.crawl(this.config.startUrl);
      logSummary(reportManager.getReport());
      reportManager.saveReport();
      logInfo("Crawl complete.");
    } catch (error) {
      logInfo(`\nCrawl failed: ${error.message}`);
      logInfo('Generating partial report...');
      reportManager.saveReport();
      throw error;
    }
  }
}

module.exports = new Crawler(); 