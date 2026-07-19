/**
 * Converts an array of flat objects into a CSV file and triggers a download.
 * No external library needed for plain CSV.
 */
export function exportToCSV(rows, filename = "export.csv") {
  if (!rows || rows.length === 0) return;

  const headers = Object.keys(rows[0]);
  const escape = (val) => `"${String(val ?? "").replace(/"/g, '""')}"`;

  const csvLines = [
    headers.join(","),
    ...rows.map((row) => headers.map((h) => escape(row[h])).join(",")),
  ];

  const blob = new Blob([csvLines.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Exports the given element's printable content as a PDF using the
 * browser's native print-to-PDF flow — no extra dependency required.
 * Opens a print dialog scoped to a lightweight, clean report layout.
 */
export function exportToPDF(title, rows, columns) {
  const printWindow = window.open("", "_blank");
  if (!printWindow) return;

  const tableRows = rows
    .map(
      (row) =>
        `<tr>${columns.map((col) => `<td style="padding:8px;border-bottom:1px solid #e4e8f0;">${row[col.key] ?? ""}</td>`).join("")}</tr>`
    )
    .join("");

  const tableHead = columns.map((col) => `<th style="text-align:left;padding:8px;border-bottom:2px solid #1a1f2e;">${col.label}</th>`).join("");

  printWindow.document.write(`
    <html>
      <head>
        <title>${title}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 24px; color: #1a1f2e; }
          h1 { font-size: 20px; margin-bottom: 16px; }
          table { width: 100%; border-collapse: collapse; font-size: 13px; }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        <table>
          <thead><tr>${tableHead}</tr></thead>
          <tbody>${tableRows}</tbody>
        </table>
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
}
