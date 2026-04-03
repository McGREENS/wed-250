import { NextResponse } from 'next/server';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const session = await auth();
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const reportType = searchParams.get('type') || 'revenue';
    const dateRange = searchParams.get('range') || '30days';
    const format = searchParams.get('format') || 'csv';

    const reportUrl = new URL('/api/admin/reports', request.url);
    reportUrl.searchParams.set('type', reportType);
    reportUrl.searchParams.set('range', dateRange);

    const reportRes = await fetch(reportUrl.toString(), {
      headers: {
        cookie: request.headers.get('cookie') || '',
      },
    });

    if (!reportRes.ok) {
      return NextResponse.json({ error: 'Failed to fetch report data' }, { status: 500 });
    }

    const reportData = await reportRes.json();

    if (format === 'csv') {
      return generateCSV(reportData, reportType, dateRange);
    } else if (format === 'pdf') {
      return generatePDF(reportData, reportType, dateRange);
    }

    return NextResponse.json({ error: 'Invalid format' }, { status: 400 });
  } catch (error) {
    console.error('Error exporting report:', error);
    return NextResponse.json({ error: 'Failed to export report' }, { status: 500 });
  }
}

function generateCSV(reportData: any, reportType: string, dateRange: string) {
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `${reportType}-report-${dateRange}-${timestamp}.csv`;

  let csvContent = `${reportType.toUpperCase()} REPORT\n`;
  csvContent += `Generated: ${new Date().toLocaleString()}\n`;
  csvContent += `Date Range: ${dateRange}\n\n`;

  csvContent += 'SUMMARY\n';
  if (reportData.summary) {
    reportData.summary.forEach((item: any) => {
      csvContent += `${item.label},${item.value},${item.change ? item.change + '%' : ''}\n`;
    });
  }
  csvContent += '\n';

  csvContent += 'DETAILED DATA\n';
  if (reportData.columns && reportData.detailedData) {
    csvContent += reportData.columns.join(',') + '\n';
    
    reportData.detailedData.forEach((row: any) => {
      const values = Object.values(row).map((cell: any) => {
        if (typeof cell === 'object' && cell !== null && cell.value) {
          return cell.value;
        }
        return cell;
      });
      csvContent += values.join(',') + '\n';
    });
  }

  return new NextResponse(csvContent, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
}

function generatePDF(reportData: any, reportType: string, dateRange: string) {
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `${reportType}-report-${dateRange}-${timestamp}.pdf`;

  let htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; padding: 40px; color: #333; }
    h1 { color: #8B3A3A; border-bottom: 3px solid #8B3A3A; padding-bottom: 10px; }
    h2 { color: #555; margin-top: 30px; }
    .header { margin-bottom: 30px; }
    .meta { color: #666; font-size: 14px; }
    .summary { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin: 30px 0; }
    .summary-card { border: 1px solid #ddd; padding: 15px; border-radius: 8px; }
    .summary-card h3 { margin: 0 0 10px 0; font-size: 14px; color: #666; }
    .summary-card .value { font-size: 24px; font-weight: bold; color: #8B3A3A; }
    .summary-card .change { font-size: 12px; color: #27AE60; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    th { background: #8B3A3A; color: white; padding: 12px; text-align: left; }
    td { padding: 10px; border-bottom: 1px solid #ddd; }
    tr:hover { background: #f5f5f5; }
    .badge { padding: 4px 8px; border-radius: 4px; font-size: 12px; }
    .badge-green { background: #d4edda; color: #155724; }
    .badge-yellow { background: #fff3cd; color: #856404; }
    .badge-blue { background: #d1ecf1; color: #0c5460; }
    .footer { margin-top: 50px; text-align: center; color: #999; font-size: 12px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>${reportType.toUpperCase()} REPORT</h1>
    <div class="meta">
      <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
      <p><strong>Date Range:</strong> ${dateRange}</p>
      <p><strong>Report Type:</strong> ${reportType}</p>
    </div>
  </div>

  <h2>Summary</h2>
  <div class="summary">
    ${reportData.summary?.map((item: any) => `
      <div class="summary-card">
        <h3>${item.label}</h3>
        <div class="value">${item.value}</div>
        ${item.change ? `<div class="change">+${item.change}% vs previous</div>` : ''}
      </div>
    `).join('') || ''}
  </div>

  <h2>Detailed Data</h2>
  <table>
    <thead>
      <tr>
        ${reportData.columns?.map((col: string) => `<th>${col}</th>`).join('') || ''}
      </tr>
    </thead>
    <tbody>
      ${reportData.detailedData?.map((row: any) => `
        <tr>
          ${Object.values(row).map((cell: any) => {
            if (typeof cell === 'object' && cell !== null && cell.value) {
              return `<td><span class="badge ${cell.className.includes('green') ? 'badge-green' : cell.className.includes('yellow') ? 'badge-yellow' : 'badge-blue'}">${cell.value}</span></td>`;
            }
            return `<td>${cell}</td>`;
          }).join('')}
        </tr>
      `).join('') || ''}
    </tbody>
  </table>

  <div class="footer">
    <p>Andiza - Rwanda's Premier Wedding Planning Platform</p>
    <p>© ${new Date().getFullYear()} Andiza. All rights reserved.</p>
  </div>
</body>
</html>
  `;

  return new NextResponse(htmlContent, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
}
