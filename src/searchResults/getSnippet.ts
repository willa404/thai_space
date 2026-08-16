export const getSnippet = (text: string, query: string, maxLength = 120) => {
  if (!query.trim()) return text.slice(0, maxLength);

  const index = text.toLowerCase().indexOf(query.toLowerCase());
  if (index === -1) return text.slice(0, maxLength);

  const start = Math.max(0, index - 30);
  const end = Math.min(text.length, index + maxLength);

  return (
    (start > 0 ? "..." : "") +
    text.slice(start, end) +
    (end < text.length ? "..." : "")
  );
};
