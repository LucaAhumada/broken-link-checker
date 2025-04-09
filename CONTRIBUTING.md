# Contributing to Broken Links Crawler

Thank you for your interest in contributing to the Broken Links Crawler! This document provides guidelines and instructions for contributing to this project.

## Project Structure

The project follows this structure:

```
broken-links/
├── src/
│   ├── config/     # Configuration files
│   ├── utils/      # Utility functions and helpers
│   └── crawler.js  # Main crawler implementation
├── reports/        # Generated reports
├── package.json
├── README.md
├── CONTRIBUTING.md
└── .gitignore
```

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct. Please be respectful and considerate of others.

## How to Contribute

1. Fork the repository
2. Create a new branch for your feature or bugfix
3. Make your changes
4. Test your changes
5. Submit a pull request

## Development Setup

1. Clone your fork:

   ```bash
   git clone https://github.com/yourusername/broken-links.git
   cd broken-links
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a test configuration:
   ```bash
   cp src/config/config.json.example src/config/config.json
   ```

## Testing

Before submitting a pull request, please ensure:

1. All tests pass (if applicable)
2. Your code follows the project's coding style
3. You've added or updated documentation as needed
4. You've tested the changes with different configurations
5. The HTML report is generated correctly
6. The console output is properly formatted

## Pull Request Process

1. Update the README.md with details of changes if needed
2. Update the CHANGELOG.md with details of changes
3. The PR must pass all CI checks
4. The PR must be reviewed and approved by at least one maintainer

## Code Style

- Use 2 spaces for indentation
- Use semicolons
- Use camelCase for variables and functions
- Use PascalCase for classes
- Use descriptive variable and function names
- Add comments for complex logic
- Keep functions small and focused

## HTML Report Guidelines

When modifying the report generation:

1. Maintain Bootstrap styling for consistency
2. Keep tables responsive
3. Ensure links are properly formatted and clickable
4. Include clear status indicators
5. Add appropriate error messages
6. Keep the report layout clean and readable

## Reporting Bugs

When reporting bugs, please include:

1. The version of the crawler you're using
2. Your configuration file (with sensitive information removed)
3. Steps to reproduce the issue
4. Expected behavior
5. Actual behavior
6. Any error messages or logs
7. Screenshot of the HTML report if relevant

## Feature Requests

For feature requests, please:

1. Describe the feature you'd like to see
2. Explain why this feature would be useful
3. Provide examples of how the feature would work
4. Consider how it would affect the HTML report

## Questions and Support

If you have questions or need support:

1. Check the documentation
2. Search existing issues
3. If you can't find an answer, open a new issue

Thank you for contributing!
