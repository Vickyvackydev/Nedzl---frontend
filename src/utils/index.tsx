export const formatPrice = (num: number): string => {
  if (num >= 1_000_000_000) return `${(num / 1_000_000_000)?.toFixed(1)}B`;
  if (num >= 1_000_000) return `${(num / 1_000_000)?.toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000)?.toFixed(1)}K`;
  return num?.toString();
};

export const buildQueryStrings = (params: Record<string, any>) => {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.append(key, String(value));
    }
  });

  return query.toString();
};

export const formatText = (text: string) =>
  text.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
