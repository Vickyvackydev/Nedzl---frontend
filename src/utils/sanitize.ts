import DOMPurify from "dompurify";

export const sanitizeRichText = (html: string): string => {
  return DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
  });
};
