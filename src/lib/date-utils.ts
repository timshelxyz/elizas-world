export function formatDateTime(date: Date | null): string {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    return 'N/A';
  }

  // Use fixed options to ensure consistent formatting between server and client
  const options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'UTC' // Use UTC to ensure consistency
  };

  return new Date(date).toLocaleString('en-US', options);
}