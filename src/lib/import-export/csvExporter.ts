
export function parseJsonToCsv(data: any[]): string {
  if (!data || !data.length) return '';
  
  // Get headers from the first item
  const headers = Object.keys(data[0]);
  
  // Create CSV header row
  const csvRows = [headers.join(',')];
  
  // Add data rows
  for (const item of data) {
    const values = headers.map(header => {
      const value = item[header];
      
      // Handle different data types
      if (value === null || value === undefined) {
        return '';
      } else if (typeof value === 'string') {
        // Escape quotes and wrap in quotes if contains comma
        const escaped = value.replace(/"/g, '""');
        return escaped.includes(',') ? `"${escaped}"` : escaped;
      } else if (typeof value === 'object') {
        // Convert objects to JSON string
        const json = JSON.stringify(value);
        return `"${json.replace(/"/g, '""')}"`;
      }
      
      return String(value);
    });
    
    csvRows.push(values.join(','));
  }
  
  return csvRows.join('\n');
}

export function downloadCsv(data: string, filename = 'export.csv'): void {
  const blob = new Blob([data], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
