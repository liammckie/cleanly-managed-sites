
/**
 * Parses a CSV string into an array of objects
 * @param csvString The CSV string to parse
 * @param hasHeader Whether the CSV has a header row
 * @returns Array of objects
 */
export function parseCSV(csvString: string, hasHeader: boolean = true): any[] {
  if (!csvString) {
    return [];
  }
  
  // Split the CSV into rows
  const rows = csvString.split(/\r?\n/).filter(row => row.trim() !== '');
  
  if (rows.length === 0) {
    return [];
  }
  
  // Get headers (from first row if hasHeader, or generate default headers)
  const headers = hasHeader
    ? parseCSVRow(rows[0])
    : Array.from({ length: parseCSVRow(rows[0]).length }, (_, i) => `field${i + 1}`);
  
  // Parse data rows
  const dataRows = hasHeader ? rows.slice(1) : rows;
  
  return dataRows.map(row => {
    const values = parseCSVRow(row);
    const obj: Record<string, any> = {};
    
    // Map each value to its header
    headers.forEach((header, index) => {
      if (index < values.length) {
        const value = values[index];
        
        // Try to parse numbers and JSON
        if (value === '') {
          obj[header] = null;
        } else if (!isNaN(Number(value)) && !value.startsWith('0') && value.trim() !== '') {
          obj[header] = Number(value);
        } else if ((value.startsWith('{') && value.endsWith('}')) || 
                 (value.startsWith('[') && value.endsWith(']'))) {
          try {
            obj[header] = JSON.parse(value);
          } catch (e) {
            obj[header] = value;
          }
        } else {
          obj[header] = value;
        }
      }
    });
    
    return obj;
  });
}

/**
 * Parses a single CSV row, respecting quoted values
 * @param row The CSV row to parse
 * @returns Array of values
 */
function parseCSVRow(row: string): string[] {
  const result: string[] = [];
  let inQuotes = false;
  let currentValue = '';
  
  for (let i = 0; i < row.length; i++) {
    const char = row[i];
    const nextChar = i < row.length - 1 ? row[i + 1] : '';
    
    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote within quotes
        currentValue += '"';
        i++; // Skip the next quote
      } else {
        // Toggle quotes state
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      // End of field
      result.push(currentValue);
      currentValue = '';
    } else {
      // Normal character
      currentValue += char;
    }
  }
  
  // Add the last value
  result.push(currentValue);
  
  return result;
}
