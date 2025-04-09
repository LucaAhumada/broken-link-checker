# Broken Link Checker

A Node.js tool to crawl websites and check for broken links. This tool helps you identify and fix broken links on your website by generating a detailed report.

## Features

- Crawls websites and checks for broken links
- Generates detailed HTML reports
- Configurable crawling depth and concurrency
- Supports both relative and absolute URLs
- Color-coded console output for better visibility

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

1. Configure your settings in `src/config/config.js`

2. Run the crawler:

```bash
npm run crawl
```

3. Generate the report:

```bash
npm run report
```

The report will be generated as `report.html` in the project root directory.

## Project Structure

```
broken-link-checker/
├── src/
│   ├── config/        # Configuration files
│   ├── utils/         # Utility functions
│   ├── crawler.js     # Main crawler implementation
│   └── generate-report.js  # Report generation
├── package.json       # Project dependencies and scripts
├── report.html        # Generated report
└── README.md         # This file
```

## Dependencies

- axios: For making HTTP requests
- chalk: For colored console output
- cheerio: For parsing HTML

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
