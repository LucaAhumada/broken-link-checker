# Broken Link Checker

A Node.js tool to crawl websites and check for broken links. This tool helps you identify and fix broken links on your website by generating a detailed report.

## Features

- Crawls websites and checks for broken links
- Generates detailed HTML reports
- Configurable crawling depth and concurrency
- Supports both relative and absolute URLs
- Color-coded console output for better visibility
- Automatic retry mechanism for failed requests
- Configurable exclusion patterns for URLs

## Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/broken-link-checker.git
cd broken-link-checker
```

2. Install dependencies:

```bash
npm install
```

## Usage

1. Configure your settings in `src/config/config.json`:

   - Set your target website URL in `startUrl`
   - Adjust crawling parameters like `maxDepth`, `timeout`, etc.
   - Configure report output location in `outputFile`

2. Run the crawler:

```bash
npm run crawl
```

The crawler will:

- Start crawling from the configured URL
- Check all links it finds
- Generate an HTML report automatically
- Save the report to the configured location (default: `reports/crawl-report.html`)

## Project Structure

```
broken-link-checker/
├── src/
│   ├── config/        # Configuration files
│   │   └── config.json  # Main configuration file
│   ├── utils/         # Utility functions
│   │   ├── logger.js    # Logging utilities
│   │   └── generate-report.js  # Report generation
│   └── crawler.js     # Main crawler implementation
├── reports/           # Generated reports directory
├── package.json       # Project dependencies and scripts
└── README.md         # This file
```

## Configuration Options

The following options can be configured in `src/config/config.json`:

- `startUrl`: The URL to start crawling from
- `maxDepth`: Maximum depth to crawl (default: 2)
- `timeout`: Request timeout in milliseconds (default: 10000)
- `followRedirects`: Whether to follow redirects (default: true)
- `checkExternalLinks`: Whether to check external links (default: false)
- `userAgent`: User agent string for requests
- `excludePatterns`: Array of URL patterns to exclude
- `outputFile`: Path to save the report (default: "reports/crawl-report.html")
- `retryCount`: Number of retries for failed requests (default: 2)
- `retryDelay`: Delay between retries in milliseconds (default: 1000)

## Dependencies

- axios: For making HTTP requests
- cheerio: For parsing HTML

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
