export function generateChatTitle(firstMessage: string): string {
  const cleaned = firstMessage.trim();
  if (cleaned.length <= 30) return cleaned;

  // Try to find a natural break point
  const sentences = cleaned.split(/[.!?]/);
  if (sentences[0] && sentences[0].length <= 30) {
    return sentences[0].trim();
  }

  // Find last space before 30 chars
  const truncated = cleaned.substring(0, 30);
  const lastSpace = truncated.lastIndexOf(" ");

  return lastSpace > 15
    ? truncated.substring(0, lastSpace) + "..."
    : truncated + "...";
}

export function truncate(s: string, n: number) {
  return s.length > n ? s.slice(0, n - 1) + "…" : s;
}

export function nid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}
