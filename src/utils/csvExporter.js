export const buildCsv = (rows, headers) => {
  const escapeValue = (value) => {
    const stringValue = value == null ? '' : String(value);
    return /[",\n]/.test(stringValue) ? `"${stringValue.replace(/"/g, '""')}"` : stringValue;
  };

  const headerLine = headers.map(escapeValue).join(',');
  const bodyLines = rows.map((row) => headers.map((header) => escapeValue(row[header])).join(','));
  return [headerLine, ...bodyLines].join('\n');
};
