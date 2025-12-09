import { Filter } from "../types";

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
export const buildQueryParams = (
  filters: Filter[],
  fieldToQueryKey: Record<string | number, string | number>
): Record<string | number, string | number> => {
  const queryParams: Record<string | number, string | number> = {};

  filters.forEach((filter) => {
    if (filter.field && filter.value) {
      const queryKey = fieldToQueryKey[filter.field];
      if (queryKey) {
        queryParams[queryKey] = filter.value;
      }
    }
  });

  return queryParams;
};

export const formatText = (text: string) => {
  if (!text) return "";
  return text.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
};

export function formatTimeElapsed(date: string): string {
  const now = new Date();
  const createdDate = new Date(date);
  const diffInSeconds = Math.floor(
    (now.getTime() - createdDate.getTime()) / 1000
  );

  if (diffInSeconds < 60)
    return diffInSeconds === 1
      ? "1 second ago"
      : `${diffInSeconds} seconds ago`;
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60)
    return diffInMinutes === 1 ? "1 min ago" : `${diffInMinutes} mins ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24)
    return diffInHours === 1 ? "1 hour ago" : `${diffInHours} hours ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7)
    return diffInDays === 1 ? "1 day ago" : `${diffInDays} days ago`;
  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4)
    return diffInWeeks === 1 ? "1 week ago" : `${diffInWeeks} weeks ago`;
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12)
    return diffInMonths === 1 ? "1 month ago" : `${diffInMonths} months ago`;
  const diffInYears = Math.floor(diffInMonths / 12);
  return diffInYears === 1 ? "1 year ago" : `${diffInYears} years ago`;
}

export const getMembershipDuration = (createdAt: string | Date) => {
  const start = new Date(createdAt);
  const now = new Date();

  const diffMs = now.getTime() - start.getTime();

  // Convert ms → units
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffYears >= 1) {
    return `${diffYears} year${diffYears > 1 ? "s" : ""} on NEDZL`;
  }

  if (diffMonths >= 1) {
    return `${diffMonths} month${diffMonths > 1 ? "s" : ""} on NEDZL`;
  }

  if (diffDays >= 1) {
    return `${diffDays} day${diffDays > 1 ? "s" : ""} on NEDZL`;
  }

  return "Just joined NEDZL";
};
