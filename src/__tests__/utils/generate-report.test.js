const { generateTable, generateReport } = require('../../utils/generate-report');

describe('generateTable', () => {
  test('should generate empty state when no links provided', () => {
    const result = generateTable('Test Section', [], 'success', '✅');
    expect(result).toContain('No test section found');
    expect(result).toContain('empty-state');
    expect(result).toContain('Test Section');
    expect(result).toContain('0');
  });

  test('should generate table with correct duration classes', () => {
    const links = [
      { url: 'http://fast.com', duration: 300, status: 200, source: 'http://source.com' },
      { url: 'http://medium.com', duration: 1000, status: 200, source: 'http://source.com' },
      { url: 'http://slow.com', duration: 2000, status: 200, source: 'http://source.com' },
      { url: 'http://veryslow.com', duration: 4000, status: 200, source: 'http://source.com' }
    ];

    const result = generateTable('Test Section', links, 'success', '✅');
    expect(result).toContain('duration-fast');
    expect(result).toContain('duration-medium');
    expect(result).toContain('duration-slow');
    expect(result).toContain('duration-very-slow');
  });

  test('should generate correct status badges and text', () => {
    const links = [
      { url: 'http://ok.com', duration: 100, status: 200, source: 'http://source.com' },
      { url: 'http://moved.com', duration: 100, status: 301, source: 'http://source.com' },
      { url: 'http://notfound.com', duration: 100, status: 404, source: 'http://source.com' },
      { url: 'http://error.com', duration: 100, status: 500, source: 'http://source.com' }
    ];

    const result = generateTable('Test Section', links, 'success', '✅');
    expect(result).toContain('status-badge success');
    expect(result).toContain('status-badge error');
    expect(result).toContain('200 - OK');
    expect(result).toContain('301 - Moved Permanently');
    expect(result).toContain('404 - Not Found');
    expect(result).toContain('500 - Server Error');
  });

  test('should include search and filter controls', () => {
    const links = [
      { url: 'http://test.com', duration: 100, status: 200, source: 'http://source.com' }
    ];

    const result = generateTable('Test Section', links, 'success', '✅');
    expect(result).toContain('search-input');
    expect(result).toContain('status-filter');
    expect(result).toContain('form-control');
    expect(result).toContain('form-select');
  });

  test('should handle special characters in title', () => {
    const links = [{ url: 'http://test.com', duration: 100, status: 200, source: 'http://source.com' }];
    const result = generateTable('Test & Section', links, 'success', '✅');
    expect(result).toContain('test--section');
    expect(result).toContain('Test & Section');
  });
});

describe('generateReport', () => {
  test('should handle empty report', () => {
    const report = {
      ok: [],
      broken: [],
      failed: []
    };

    const result = generateReport(report);
    expect(result).toContain('Total Links Checked');
    expect(result).toContain('Success Rate');
    expect(result).toContain('Broken Links');
    expect(result).toContain('Failed Checks');
    expect(result).toContain('0%');
  });

  test('should calculate correct success rate', () => {
    const report = {
      ok: [
        { url: 'http://ok1.com', duration: 100, status: 200, source: 'http://source.com' },
        { url: 'http://ok2.com', duration: 100, status: 200, source: 'http://source.com' }
      ],
      broken: [
        { url: 'http://broken1.com', duration: 100, status: 404, source: 'http://source.com' },
        { url: 'http://broken2.com', duration: 100, status: 404, source: 'http://source.com' }
      ],
      failed: []
    };

    const result = generateReport(report);
    expect(result).toContain('50%');
    expect(result).toContain('4');
  });

  test('should generate all sections with correct styling', () => {
    const report = {
      ok: [{ url: 'http://ok.com', duration: 100, status: 200, source: 'http://source.com' }],
      broken: [{ url: 'http://broken.com', duration: 100, status: 404, source: 'http://source.com' }],
      failed: [{ url: 'http://failed.com', duration: 100, status: 500, source: 'http://source.com' }]
    };

    const result = generateReport(report);
    expect(result).toContain('section success');
    expect(result).toContain('section danger');
    expect(result).toContain('section warning');
    expect(result).toContain('Working Links');
    expect(result).toContain('Broken Links');
    expect(result).toContain('Failed Checks');
  });

  test('should include required HTML elements and dependencies', () => {
    const report = {
      ok: [],
      broken: [],
      failed: []
    };

    const result = generateReport(report);
    expect(result).toContain('<!DOCTYPE html>');
    expect(result).toContain('<html lang="en">');
    expect(result).toContain('<head>');
    expect(result).toContain('<body>');
    expect(result).toContain('bootstrap.min.css');
    expect(result).toContain('bootstrap.bundle.min.js');
    expect(result).toContain('jspdf.umd.min.js');
    expect(result).toContain('html2canvas.min.js');
  });
});