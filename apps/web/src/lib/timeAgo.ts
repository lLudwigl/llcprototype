// German-language relative time formatting for sighting timestamps.

export function timeAgo(date: Date): string {
  const diffMs = Date.now() - date.getTime();
  const diffMin = Math.floor(diffMs / 60_000);

  if (diffMin < 1) return 'gerade eben';
  if (diffMin < 60) return `vor ${diffMin} Min.`;

  const diffHours = Math.floor(diffMin / 60);
  if (diffHours === 1) return 'vor 1 Std.';
  return `vor ${diffHours} Std.`;
}
