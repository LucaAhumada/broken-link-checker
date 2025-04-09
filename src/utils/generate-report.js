const fs = require("fs");

const generateTable = (title, links, color, emoji) => {
  const rows = links.map(link => `
    <tr>
      <td><a href="${link.url}" target="_blank">${link.url}</a></td>
      <td>${link.status}</td>
      <td><a href="${link.source}" target="_blank">${link.source}</a></td>
    </tr>`).join("");

  return `
    <h3 class="mt-5 text-${color}">
      ${emoji} ${title} <span class="badge bg-secondary">${links.length}</span>
    </h3>
    <div class="table-responsive">
      <table class="table table-bordered table-hover table-striped align-middle">
        <thead class="table-light">
          <tr>
            <th>Link</th>
            <th>Status</th>
            <th>Source Page</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    </div>
  `;
};

const generateReport = (report) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Broken Link Crawler Report</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <style>
    body { padding: 2rem; }
    h1 { margin-bottom: 2rem; }
    a { word-break: break-all; }
  </style>
</head>
<body>
  <div class="container">
    <h1 class="text-dark">🔗 Broken Link Crawler Report</h1>
    ${generateTable("Working Links", report.ok, "success", "✅")}
    ${generateTable("Broken Links", report.broken, "danger", "❌")}
    ${generateTable("Failed Checks", report.failed, "warning", "⚠️")}
    <p class="text-muted mt-5">Generated on ${new Date().toLocaleString()}</p>
  </div>
</body>
</html>
  `;
};

module.exports = generateReport;