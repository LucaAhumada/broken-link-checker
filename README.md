# Broken Link Checker 🔗

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm version](https://badge.fury.io/js/broken-link-checker.svg)](https://badge.fury.io/js/broken-link-checker)

# 🚀 Like this project? Show your support! ![GitHub Repo stars](https://img.shields.io/github/stars/LucaAhumada/broken-link-checker?style=social)


A robust Node.js tool to crawl websites and check for broken links. This tool helps you identify and fix broken links on your website by generating detailed reports, ensuring your website maintains optimal link health.

![broken-link-checker](https://github.com/user-attachments/assets/a636ee52-734a-4aaa-adaa-2bc9ed9c6119)

## ✨ Features

- 🔍 Crawls websites and checks for broken links
- 📊 Generates detailed HTML reports
- ⚙️ Configurable crawling depth and concurrency
- 🔗 Supports both relative and absolute URLs
- 🎨 Color-coded console output for better visibility
- 🔄 Automatic retry mechanism for failed requests
- 🚫 Configurable exclusion patterns for URLs
- 🌐 Supports checking external links
- ⏱️ Configurable request timeouts
- 🔄 Follows redirects automatically

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)
- [Support](#support)
- [Acknowledgments](#acknowledgments)

## Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/LucaAhumada/broken-link-checker.git
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

2. Run the crawler:

```bash
npm run crawl
```

The crawler will:

- Start crawling from the configured URL
- Check all links it finds
- Generate an HTML report automatically
- Save the report to the configured location (default: `reports/crawl-report.html`)
- Open the report automatically in your default browser

## Configuration

The following options can be configured in `src/config/config.json`:

| Option | Description | Default |
|--------|-------------|---------|
| `startUrl` | The URL to start crawling from | Required |
| `maxDepth` | Maximum depth to crawl | 2 |
| `timeout` | Request timeout in milliseconds | 10000 |
| `followRedirects` | Whether to follow redirects | true |
| `checkExternalLinks` | Whether to check external links | false |
| `userAgent` | User agent string for requests | Default Node.js user agent |
| `excludePatterns` | Array of URL patterns to exclude | [] |
| `outputFile` | Path to save the report | "reports/crawl-report.html" |
| `retryCount` | Number of retries for failed requests | 2 |
| `retryDelay` | Delay between retries in milliseconds | 1000 |

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

## Contributing

We welcome contributions! Please read our [Contributing Guidelines](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions, please:

- Check the [Issues](https://github.com/LucaAhumada/broken-link-checker/issues) page
- Create a new issue if your problem isn't already listed

## Acknowledgments

- Special thanks to the open-source community for their invaluable tools and libraries
- Inspired by the need for better simple and friendly tools

## Dependencies

- [axios](https://github.com/axios/axios): For making HTTP requests
- [cheerio](https://github.com/cheeriojs/cheerio): For parsing HTML

## Security

Please report any security [Issues](https://github.com/LucaAhumada/broken-link-checker/issues) and will take care ASAP.
