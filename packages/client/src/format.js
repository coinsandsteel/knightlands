export function formatDuration(seconds) {
  return new Date(seconds * 1000).toISOString();
}
