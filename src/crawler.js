const fs = require("fs");
const axios = require("axios");
const cheerio = require("cheerio");
const { URL } = require("url");
const path = require("path");
const {
  logInfo,
  logCrawling,
  logOk,
  logBroken,
  logFailed,
  logSummary
} = require("./utils/logger");
const generateReport = require("./utils/generate-report");

// Load config using absolute path
const configPath = path.join(__dirname, "config", "config.json");
const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));

const visitedPages = new Map();
const checkedLinks = new Set();
const report = {
  ok: [],
  broken: [],
  failed: []
};

async function retryRequest(requestFn, retries = config.retryCount, delay = config.retryDelay) {
  let lastError;

  for (let attempt = 1; attempt <= retries + 1; attempt++) {
    try {
      return await requestFn();
    } catch (err) {
      lastError = err;
      if (attempt <= retries) {
        await new Promise(res => setTimeout(res, delay));
      }
    }
  }

  throw lastError;
}

function normalizeUrl(link, base) {
  try {
    return new URL(link, base).href;
  } catch {
    return null;
  }
}

function shouldExclude(link) {
  return config.excludePatterns.some(pattern => link.includes(pattern));
}

function isInternal(url) {
  return new URL(url).hostname === new URL(config.startUrl).hostname;
}

async function checkLink(link, sourcePage) {
  try {
    const response = await retryRequest(() => axios.head(link, {
      timeout: config.timeout,
      maxRedirects: config.followRedirects ? 5 : 0,
      headers: { "User-Agent": config.userAgent },
      validateStatus: null
    }));

    const status = response.status;

    if (status >= 400) {
      logBroken(link, status, sourcePage);
      report.broken.push({ url: link, status, source: sourcePage });
    } else {
      logOk(link, status);
      report.ok.push({ url: link, status, source: sourcePage });
    }
  } catch (err) {
    logFailed(link, err.message, sourcePage);
    report.failed.push({ url: link, status: "error", message: err.message, source: sourcePage });
  }
}

async function crawl(url, depth = 0) {
  const existingDepth = visitedPages.get(url);

  if (existingDepth !== undefined && depth >= existingDepth) return;
  if (depth > config.maxDepth) return;

  visitedPages.set(url, depth);

  let html;
  try {
    const res = await retryRequest(() => axios.get(url, {
      timeout: config.timeout,
      headers: { "User-Agent": config.userAgent }
    }));
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
    if (shouldExclude(link)) continue;

    const fullUrl = normalizeUrl(link, url);
    if (!fullUrl || checkedLinks.has(fullUrl)) continue;

    checkedLinks.add(fullUrl);

    const internal = isInternal(fullUrl);

    if (internal || config.checkExternalLinks) {
      await checkLink(fullUrl, url);
    }

    if (internal) {
      await crawl(fullUrl, depth + 1);
    }
  }
}

(async () => {
  logInfo(`Starting crawl at: ${config.startUrl}`);
  await crawl(config.startUrl);
  logSummary(report);

  if (config.outputFile) {
    // Create reports directory if it doesn't exist
    const reportDir = path.dirname(config.outputFile);
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }
    
    const reportContent = generateReport(report);
    fs.writeFileSync(config.outputFile, reportContent);
    logInfo(`Report saved to ${config.outputFile}`);
  }

  logInfo("Crawl complete.");
})();
