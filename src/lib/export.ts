/**
 * Converts an array of objects to CSV and triggers a download.
 * @param data Array of objects to export
 * @param filename Name of the file (without extension)
 */
export function exportToCSV<T extends Record<string, any>>(data: T[], filename: string) {
    if (!data || !data.length) {
        console.warn('Export: No data to export');
        return;
    }

    // Generate headers from the first object keys
    const headers = Object.keys(data[0]).join(',');

    // Map rows
    const rows = data.map(row =>
        Object.values(row).map(value => {
            const stringValue = String(value);
            // Escape quotes and wrap in quotes if it contains a comma
            return stringValue.includes(',') ? `"${stringValue}"` : stringValue;
        }).join(',')
    );

    const csvContent = [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}