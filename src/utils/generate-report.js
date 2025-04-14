const fs = require("fs");

const sanitizeSectionId = (title) => {
  return title.toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '--')
    .replace(/-{3,}/g, '--');
};

const generateTable = (title, links, color, emoji) => {
  if (links.length === 0) {
    const sectionId = sanitizeSectionId(title);
    return `
      <div class="section ${color}">
        <div class="section-header" data-bs-toggle="collapse" data-bs-target="#${sectionId}-section">
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

  const sectionId = sanitizeSectionId(title);

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
      <div class="section-header" data-bs-toggle="collapse" data-bs-target="#${sectionId}-section">
        <span class="emoji">${emoji}</span>
        <h3>${title}</h3>
        <span class="badge">${links.length}</span>
        <span class="collapse-icon">▼</span>
      </div>
      <div class="collapse show" id="${sectionId}-section">
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
                  <input type="text" class="form-control search-input" id="search-${sectionId}" placeholder="Search URLs...">
                </div>
              </div>
              <div class="col-md-6">
                <select class="form-select status-filter" id="status-${sectionId}">
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
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
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

    .data-table th,
    .data-table td {
      padding: 1rem;
    }

    .data-table th {
      background: #f8f9fa;
      text-align: left;
      font-weight: 600;
      color: var(--primary-color);
      cursor: pointer;
      position: relative;
    }

    .data-table td {
      border-top: 1px solid var(--border-color);
    }

    /* Column width distribution */
    .data-table th:nth-child(1),
    .data-table td:nth-child(1) {
      width: 40%;
    }

    .data-table th:nth-child(2),
    .data-table td:nth-child(2) {
      width: 15%;
      white-space: nowrap;
    }

    .data-table th:nth-child(3),
    .data-table td:nth-child(3) {
      width: 15%;
      white-space: nowrap;
    }

    .data-table th:nth-child(4),
    .data-table td:nth-child(4) {
      width: 30%;
    }

    .url-cell a, .source-cell a {
      color: #0066cc;
      text-decoration: none;
      word-break: break-all;
      display: block;
    }

    .url-cell a:hover, .source-cell a:hover {
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

    .export-buttons {
      display: flex;
      gap: 1rem;
      justify-content: center;
      margin: 2rem 0;
    }

    .export-btn {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: background-color 0.2s;
    }

    .export-btn.pdf {
      background-color: #e74c3c;
      color: white;
    }

    .export-btn.csv {
      background-color: #2ecc71;
      color: white;
    }

    .export-btn:hover {
      opacity: 0.9;
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

    <div class="export-buttons">
      <button class="export-btn pdf" onclick="exportToPDF()">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path d="M5.523 12.424c.14-.082.293-.162.459-.238a7.878 7.878 0 0 1-.45.606c-.28.337-.498.516-.635.572a.266.266 0 0 1-.035.012.282.282 0 0 1-.026-.044c-.056-.11-.054-.216.04-.36.106-.165.319-.354.647-.548zm2.455-1.647c-.119.025-.237.05-.356.078a21.148 21.148 0 0 0 .5-1.05 12.045 12.045 0 0 0 .51.858c.217.272.368.46.422.567a.09.09 0 0 1 .01.025.06.06 0 0 1 .01.01c.01.01.01.01.01.01l.01-.01a.09.09 0 0 1 .01-.025c.054-.107.205-.295.422-.567.16-.2.33-.43.51-.858a21.148 21.148 0 0 0-.5-1.05c-.12.028-.238.053-.356.078a21.148 21.148 0 0 0 .5 1.05c.16.2.33.43.51.858a21.148 21.148 0 0 0-.5 1.05zm2.455-1.647c-.119.025-.237.05-.356.078a21.148 21.148 0 0 0 .5-1.05 12.045 12.045 0 0 0 .51.858c.217.272.368.46.422.567a.09.09 0 0 1 .01.025.06.06 0 0 1 .01.01c.01.01.01.01.01.01l.01-.01a.09.09 0 0 1 .01-.025c.054-.107.205-.295.422-.567.16-.2.33-.43.51-.858a21.148 21.148 0 0 0-.5-1.05c-.12.028-.238.053-.356.078a21.148 21.148 0 0 0 .5 1.05c.16.2.33.43.51.858a21.148 21.148 0 0 0-.5 1.05z"/>
          <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5v2z"/>
        </svg>
        Export as PDF
      </button>
      <button class="export-btn csv" onclick="exportToCSV()">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
          <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
        </svg>
        Export as CSV
      </button>
    </div>

    <div class="footer">
      <p>Generated on ${new Date().toLocaleString()}</p>
      <p>Like this tool? Show your support by giving a <a href="https://github.com/LucaAhumada/broken-link-checker" target="_blank" rel="noopener noreferrer">Star</a>!</p>
    </div>
  </div>

  <script>
    document.addEventListener('DOMContentLoaded', function() {
      // Store the initial state of the report
      const initialReportState = document.querySelector('.container').innerHTML;
      
      // Add click handlers for collapsible sections
      document.querySelectorAll('.section-header').forEach(header => {
        header.addEventListener('click', function() {
          this.classList.toggle('collapsed');
        });
      });

      // Add search and filter functionality for each section
      document.querySelectorAll('.section').forEach(section => {
        const searchInput = section.querySelector('.search-input');
        const statusFilter = section.querySelector('.status-filter');
        const table = section.querySelector('.data-table');
        
        if (searchInput && statusFilter && table) {
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
        }
      });

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

      // Export to PDF functionality
      window.exportToPDF = async function() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        try {
          console.log('Starting PDF generation...');
          
          // Create a temporary container with the initial state
          const tempContainer = document.createElement('div');
          tempContainer.innerHTML = initialReportState;
          tempContainer.style.position = 'absolute';
          tempContainer.style.left = '-9999px';
          tempContainer.style.width = '1200px';
          document.body.appendChild(tempContainer);
          
          console.log('Temporary container created');
          
          // Ensure all sections are expanded in the temporary container
          const sections = tempContainer.querySelectorAll('.section');
          sections.forEach(section => {
            const collapse = section.querySelector('.collapse');
            if (collapse) {
              collapse.classList.add('show');
              const header = section.querySelector('.section-header');
              if (header) {
                header.classList.remove('collapsed');
              }
            }
          });
          
          console.log('Sections expanded');
          
          // Wait a moment for the DOM to update
          await new Promise(resolve => setTimeout(resolve, 100));
          
          // Use html2canvas to capture the report with optimized settings
          console.log('Starting html2canvas...');
          const canvas = await html2canvas(tempContainer, {
            scale: 1, // Reduced from 2
            useCORS: true,
            logging: true,
            allowTaint: true,
            backgroundColor: '#ffffff',
            width: tempContainer.offsetWidth,
            height: tempContainer.offsetHeight,
            windowWidth: tempContainer.offsetWidth,
            windowHeight: tempContainer.offsetHeight,
            imageTimeout: 0, // Disable image timeout
            removeContainer: true // Clean up temporary elements
          });
          
          console.log('Canvas created');
          
          // Remove the temporary container
          document.body.removeChild(tempContainer);
          
          // Convert canvas to JPEG with quality optimization
          const imgData = canvas.toDataURL('image/jpeg', 0.85); // Using JPEG with 85% quality
          console.log('Image data created');
          
          const imgWidth = 210; // A4 width in mm
          const pageHeight = 295; // A4 height in mm
          const imgHeight = canvas.height * imgWidth / canvas.width;
          let heightLeft = imgHeight;
          let position = 0;
          
          // Add the first page
          doc.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
          
          // Add new pages if content is longer than one page
          while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            doc.addPage();
            doc.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
          }
          
          console.log('PDF generation complete');
          // Save the PDF
          doc.save('broken-link-report.pdf');
        } catch (error) {
          console.error('Error generating PDF:', error);
          console.error('Error stack:', error.stack);
          alert('There was an error generating the PDF. Please check the console for details.');
        }
      };

      // Export to CSV functionality
      window.exportToCSV = function() {
        // Get all tables
        const tables = document.querySelectorAll('.data-table');
        let csvContent = '';
        
        tables.forEach((table, tableIndex) => {
          const title = table.closest('.section').querySelector('h3').textContent;
          csvContent += title + '\\n';
          
          // Get headers
          const headers = Array.from(table.querySelectorAll('th')).map(th => th.textContent);
          csvContent += headers.join(',') + '\\n';
          
          // Get rows
          const rows = table.querySelectorAll('tbody tr');
          rows.forEach(row => {
            const cells = Array.from(row.querySelectorAll('td')).map(td => {
              let content = td.textContent.trim();
              // Handle links
              const link = td.querySelector('a');
              if (link) {
                content = link.href;
              }
              // Escape commas and quotes
              if (content.includes(',') || content.includes('"')) {
                content = '"' + content.replace(/"/g, '""') + '"';
              }
              return content;
            });
            csvContent += cells.join(',') + '\\n';
          });
          
          // Add a blank line between tables
          if (tableIndex < tables.length - 1) {
            csvContent += '\\n';
          }
        });
        
        // Create and trigger download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'broken-link-report.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      };
    });
  </script>
</body>
</html>
  `;
};

module.exports = {
  generateTable,
  generateReport
};