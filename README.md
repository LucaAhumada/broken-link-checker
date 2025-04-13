# Broken Link Checker 🔗

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm version](https://badge.fury.io/js/broken-link-checker.svg)](https://badge.fury.io/js/broken-link-checker)

# 🚀 Like this project? Give a Star! ⭐️

A robust Node.js tool to crawl websites and check for broken links. This tool helps you identify and fix broken links on your website by generating detailed reports, ensuring your website maintains optimal link health.

[Live Report Example](https://broken-link-checker-report-example.vercel.app)

![broken-link-checker](https://github.com/user-attachments/assets/ab1e41e4-e0c0-4934-9633-43bbcb1ca0e1)

## ✨ Features

- 🔍 Advanced website crawling with configurable depth
- 📊 Comprehensive HTML reports with detailed statistics
- ⚙️ Flexible configuration system with JSON support
- 🔗 Smart URL handling for both relative and absolute URLs
- 🎨 Enhanced console output with color-coded status indicators
- 🔄 Robust retry mechanism for failed requests
- 🚫 Configurable URL exclusion patterns
- 🌐 External link checking with timeout support
- ⏱️ Configurable request timeouts and delays
- 🔄 Automatic redirect following with depth tracking
- 📝 Detailed logging system with multiple log levels
- 🛠️ Modular architecture for easy extension
- 📈 Performance metrics and crawl statistics
- 🔒 Secure request handling with custom user agents
- 📤 Multiple export formats (HTML, PDF, CSV)
- 🔍 Interactive report filtering and sorting
- 📱 Responsive design for all devices

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [Export Options](#export-options)
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
- Generate a comprehensive HTML report
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
| `userAgent` | Custom user agent string for requests | BrokenLinksCrawler/1.0 |
| `excludePatterns` | Array of URL patterns to exclude | ["mailto:", "tel:", "javascript:", "#"] |
| `outputFile` | Path to save the report | "reports/crawl-report.html" |
| `retryCount` | Number of retries for failed requests | 2 |
| `retryDelay` | Delay between retries in milliseconds | 1000 |

## Export Options

The tool provides multiple ways to export your crawl results:

### HTML Report
- Default export format
- Interactive interface with filtering and sorting
- Automatically opens in your default browser

### PDF Export
- Preserves main formatting and styling
- Optimized and compressed for printing and sharing

### CSV Export
- Includes all link details and metadata
- Easy to import into other tools
- Perfect for data analysis

To export your report:
1. Run the crawler as usual
2. When the report opens in your browser
3. Click the "Export as PDF" or "Export as CSV" button
4. The file will be automatically downloaded

## Project Structure

```
broken-link-checker/
├── src/
│   ├── config/        # Configuration files
│   │   ├── config.json    # Main configuration file
│   │   └── config-manager.js  # Configuration management
│   ├── core/          # Core functionality
│   │   ├── crawler.js      # Main crawler implementation
│   │   ├── report-manager.js  # Report generation and management
│   │   ├── http-handler.js    # HTTP request handling
│   │   └── url-handler.js     # URL processing utilities
│   ├── utils/         # Utility functions
│   │   ├── logger.js    # Logging utilities
│   │   └── generate-report.js  # Report generation
│   └── index.js       # Entry point
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
- [chalk](https://github.com/chalk/chalk): For terminal styling
- [fs-extra](https://github.com/jprichardson/node-fs-extra): Enhanced file system operations
- [open](https://github.com/sindresorhus/open): For opening files in the default application

## Security

Please report any security [Issues](https://github.com/LucaAhumada/broken-link-checker/issues) and we will take care of them ASAP.
