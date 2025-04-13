const fs = require("fs");

const generateTable = (title, links, color, emoji) => {
  if (links.length === 0) {
    return `
      <div class="section ${color}">
        <div class="section-header" data-bs-toggle="collapse" data-bs-target="#${title.toLowerCase().replace(/\s+/g, '-')}-section">
          <span class="emoji">${emoji}</span>
          <h3>${title}</h3>
          <span class="badge">${links.length}</span>
          <span class="collapse-icon">▼</span>
        </div>
        <div class="empty-state">
          <p>No ${title.toLowerCase()} found</p>
        </div>
      </div>
    `;
  }

  const getDurationClass = (duration) => {
    if (duration <= 500) return 'duration-fast';
    if (duration <= 1500) return 'duration-medium';
    if (duration <= 3000) return 'duration-slow';
    return 'duration-very-slow';
  };

  // Get unique status codes from the links
  const statusCodes = [...new Set(links.map(link => link.status))].sort((a, b) => a - b);
  
  // Generate status code options
  const statusOptions = statusCodes.map(code => {
    const statusText = {
      200: 'OK',
      301: 'Moved Permanently',
      302: 'Found',
      404: 'Not Found',
      500: 'Server Error'
    }[code] || `Status ${code}`;
    return `<option value="${code}">${code} - ${statusText}</option>`;
  }).join('');

  const rows = links.map(link => `
    <tr>
      <td class="url-cell">
        <a href="${link.url}" target="_blank" rel="noopener noreferrer">${link.url}</a>
      </td>
      <td class="duration-cell ${getDurationClass(link.duration)}">
        ${link.duration}ms
      </td>
      <td class="status-cell">
        <span class="status-badge ${link.status >= 400 ? 'error' : 'success'}">${link.status}</span>
      </td>
      <td class="source-cell">
        <a href="${link.source}" target="_blank" rel="noopener noreferrer">${link.source}</a>
      </td>
    </tr>`).join("");

  return `
    <div class="section ${color}">
      <div class="section-header" data-bs-toggle="collapse" data-bs-target="#${title.toLowerCase().replace(/\s+/g, '-')}-section">
        <span class="emoji">${emoji}</span>
        <h3>${title}</h3>
        <span class="badge">${links.length}</span>
        <span class="collapse-icon">▼</span>
      </div>
      <div class="collapse show" id="${title.toLowerCase().replace(/\s+/g, '-')}-section">
        <div class="table-container">
          <div class="table-controls mb-3">
            <div class="row g-3">
              <div class="col-md-6">
                <div class="input-group">
                  <span class="input-group-text">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                      <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                    </svg>
                  </span>
                  <input type="text" class="form-control" id="searchInput" placeholder="Search URLs...">
                </div>
              </div>
              <div class="col-md-6">
                <select class="form-select" id="statusFilter">
                  <option value="">Filter Status Codes</option>
                  ${statusOptions}
                </select>
              </div>
            </div>
          </div>
          <table class="data-table">
            <thead>
              <tr>
                <th>Link</th>
                <th>Duration</th>
                <th>Status</th>
                <th>Source Page</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
};

const generateReport = (report) => {
  const totalLinks = report.ok.length + report.broken.length + report.failed.length;
  const successRate = totalLinks > 0 ? Math.round((report.ok.length / totalLinks) * 100) : 0;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Broken Link Checker Report</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
  <style>
    :root {
      --primary-color: #2b2d42;
      --success-color: #2ecc71;
      --danger-color: #e74c3c;
      --warning-color: #f39c12;
      --text-color: #333;
      --border-color: #e0e0e0;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      color: var(--text-color);
      line-height: 1.6;
      background-color: #f8f9fa;
      padding: 0;
      margin: 0;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    .header {
      background-color: var(--primary-color);
      color: white;
      padding: 2rem 0;
      margin-bottom: 2rem;
      border-radius: 8px;
    }

    .header h1 {
      margin: 0;
      font-size: 2.5rem;
      font-weight: 600;
    }

    .stats-container {
      display: flex;
      gap: 1rem;
      margin: 1rem 0;
      flex-wrap: wrap;
    }

    .stat-card {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      flex: 1;
      min-width: 200px;
      transition: transform 0.2s;
    }

    .stat-card:hover {
      transform: translateY(-2px);
    }

    .stat-card h3 {
      margin: 0;
      font-size: 1.5rem;
      color: var(--primary-color);
    }

    .stat-card p {
      margin: 0.5rem 0 0;
      color: #666;
    }

    .section {
      background: white;
      border-radius: 8px;
      margin-bottom: 2rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      overflow: hidden;
    }

    .section.success { border-left: 4px solid var(--success-color); }
    .section.danger { border-left: 4px solid var(--danger-color); }
    .section.warning { border-left: 4px solid var(--warning-color); }

    .section-header {
      padding: 1rem 1.5rem;
      background: #f8f9fa;
      border-bottom: 1px solid var(--border-color);
      display: flex;
      align-items: center;
      gap: 1rem;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .section-header:hover {
      background-color: #e9ecef;
    }

    .section-header h3 {
      margin: 0;
      flex: 1;
    }

    .emoji {
      font-size: 1.5rem;
    }

    .badge {
      background: var(--primary-color);
      color: white;
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.875rem;
    }

    .collapse-icon {
      font-size: 0.875rem;
      transition: transform 0.2s;
    }

    .collapsed .collapse-icon {
      transform: rotate(-90deg);
    }

    .table-container {
      overflow-x: auto;
      padding: 1rem;
    }

    .data-table {
      width: 100%;
      border-collapse: collapse;
    }

    .data-table th {
      background: #f8f9fa;
      padding: 1rem;
      text-align: left;
      font-weight: 600;
      color: var(--primary-color);
      cursor: pointer;
      position: relative;
    }

    .data-table th:hover {
      background-color: #e9ecef;
    }

    .data-table th.sortable::after {
      content: '↕';
      position: absolute;
      right: 8px;
      color: #999;
    }

    .data-table th.sort-asc::after {
      content: '↑';
      color: var(--primary-color);
    }

    .data-table th.sort-desc::after {
      content: '↓';
      color: var(--primary-color);
    }

    .data-table td {
      padding: 1rem;
      border-top: 1px solid var(--border-color);
    }

    .data-table tr:hover {
      background-color: #f8f9fa;
    }

    .url-cell {
      max-width: 400px;
    }

    .url-cell a {
      color: #0066cc;
      text-decoration: none;
      word-break: break-all;
    }

    .url-cell a:hover {
      text-decoration: underline;
    }

    .status-badge {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.875rem;
      font-weight: 500;
    }

    .status-badge.success {
      background-color: #d4edda;
      color: #155724;
    }

    .status-badge.error {
      background-color: #f8d7da;
      color: #721c24;
    }

    .duration-cell {
      font-weight: 500;
    }

    .duration-fast {
      color: #2ecc71;
    }

    .duration-medium {
      color: #f39c12;
    }

    .duration-slow {
      color: #e67e22;
    }

    .duration-very-slow {
      color: #e74c3c;
    }

    .empty-state {
      padding: 2rem;
      text-align: center;
      color: #666;
    }

    .footer {
      text-align: center;
      padding: 1rem;
      color: #666;
      font-size: 0.875rem;
    }

    @media (max-width: 768px) {
      .container {
        padding: 1rem;
      }
      
      .header {
        padding: 1.5rem 0;
      }
      
      .header h1 {
        font-size: 2rem;
      }
      
      .stat-card {
        min-width: 100%;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header text-center">
      <h1>🔗 Broken Link Checker Report</h1>
    </div>

    <div class="stats-container">
      <div class="stat-card">
        <h3>${totalLinks}</h3>
        <p>Total Links Checked</p>
      </div>
      <div class="stat-card">
        <h3>${successRate}%</h3>
        <p>Success Rate</p>
      </div>
      <div class="stat-card">
        <h3>${report.broken.length}</h3>
        <p>Broken Links</p>
      </div>
      <div class="stat-card">
        <h3>${report.failed.length}</h3>
        <p>Failed Checks</p>
      </div>
    </div>

    ${generateTable("Working Links", report.ok, "success", "✅")}
    ${generateTable("Broken Links", report.broken, "danger", "❌")}
    ${generateTable("Failed Checks", report.failed, "warning", "⚠️")}

    <div class="footer">
      <p>Generated on ${new Date().toLocaleString()}</p>
    </div>
  </div>

  <script>
    document.addEventListener('DOMContentLoaded', function() {
      // Add click handlers for collapsible sections
      document.querySelectorAll('.section-header').forEach(header => {
        header.addEventListener('click', function() {
          this.classList.toggle('collapsed');
        });
      });

      // Add search and filter functionality
      const searchInput = document.getElementById('searchInput');
      const statusFilter = document.getElementById('statusFilter');
      const table = document.querySelector('.data-table');
      const tbody = table.querySelector('tbody');
      const rows = Array.from(tbody.querySelectorAll('tr'));

      function filterTable() {
        const searchTerm = searchInput.value.toLowerCase();
        const statusCode = statusFilter.value;

        rows.forEach(row => {
          const url = row.querySelector('.url-cell').textContent.toLowerCase();
          const status = row.querySelector('.status-badge').textContent.trim();
          const matchesSearch = url.includes(searchTerm);
          const matchesStatus = !statusCode || status.startsWith(statusCode);

          row.style.display = matchesSearch && matchesStatus ? '' : 'none';
        });
      }

      searchInput.addEventListener('input', filterTable);
      statusFilter.addEventListener('change', filterTable);

      // Add sorting functionality to tables
      document.querySelectorAll('.data-table th').forEach(header => {
        header.classList.add('sortable');
        header.addEventListener('click', function() {
          const table = this.closest('table');
          const tbody = table.querySelector('tbody');
          const rows = Array.from(tbody.querySelectorAll('tr'));
          const index = Array.from(this.parentElement.children).indexOf(this);
          const isAsc = this.classList.contains('sort-asc');
          
          // Remove sort classes from all headers
          table.querySelectorAll('th').forEach(th => {
            th.classList.remove('sort-asc', 'sort-desc');
          });
          
          // Sort rows
          rows.sort((a, b) => {
            const aValue = a.children[index].textContent.trim();
            const bValue = b.children[index].textContent.trim();
            
            // Special handling for duration column
            if (index === 1) {
              const aNum = parseInt(aValue);
              const bNum = parseInt(bValue);
              return isAsc ? aNum - bNum : bNum - aNum;
            }
            
            // Special handling for status column
            if (index === 2) {
              const aNum = parseInt(aValue);
              const bNum = parseInt(bValue);
              return isAsc ? aNum - bNum : bNum - aNum;
            }
            
            // Default string comparison
            return isAsc 
              ? aValue.localeCompare(bValue)
              : bValue.localeCompare(aValue);
          });
          
          // Update sort class
          this.classList.add(isAsc ? 'sort-desc' : 'sort-asc');
          
          // Reorder rows
          rows.forEach(row => tbody.appendChild(row));
        });
      });
    });
  </script>
</body>
</html>
  `;
};

module.exports = generateReport;