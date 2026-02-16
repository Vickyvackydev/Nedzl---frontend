import { useEffect } from "react";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogType?: string;
  ogImage?: string;
  structuredData?: object;
  noindex?: boolean;
}

const SEO = ({
  title,
  description,
  keywords,
  canonical,
  ogType = "website",
  ogImage,
  structuredData,
  noindex = false,
}: SEOProps) => {
  const baseTitle = "Nedzl.com – The Ultimate Student Marketplace";
  const fullTitle = title ? `${title} | ${baseTitle}` : baseTitle;
  const currentUrl = window.location.href;

  useEffect(() => {
    // Update Title
    document.title = fullTitle;

    // Update Meta Description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        description ||
          "Buy & Sell Used Items Easily on Nedzl.com – The trusted student-focused e-commerce platform across Nigeria.",
      );
    }

    // Update Meta Keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute(
        "content",
        keywords ||
          "student marketplace, buy used items, sell used items, university students Nigeria, Nedzl",
      );
    }

    // Update OG Title
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute("content", fullTitle);
    }

    // Update OG Description
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) {
      ogDesc.setAttribute(
        "content",
        description ||
          "The trusted student-focused e-commerce platform built to connect university students across Nigeria.",
      );
    }

    // Update OG Type
    const ogTypeMeta = document.querySelector('meta[property="og:type"]');
    if (ogTypeMeta) {
      ogTypeMeta.setAttribute("content", ogType);
    }

    // Update OG Image
    if (ogImage) {
      const ogImg = document.querySelector('meta[property="og:image"]');
      if (ogImg) {
        ogImg.setAttribute("content", ogImage);
      }
    }

    // Update OG URL
    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) {
      ogUrl.setAttribute("content", currentUrl);
    }

    // Update Twitter Tags
    const twTitle = document.querySelector('meta[property="twitter:title"]');
    if (twTitle) {
      twTitle.setAttribute("content", fullTitle);
    }
    const twDesc = document.querySelector(
      'meta[property="twitter:description"]',
    );
    if (twDesc) {
      twDesc.setAttribute(
        "content",
        description ||
          "The trusted student-focused e-commerce platform built to connect university students across Nigeria. Save money, make money, and connect easily.",
      );
    }
    if (ogImage) {
      const twImg = document.querySelector('meta[property="twitter:image"]');
      if (twImg) {
        twImg.setAttribute("content", ogImage);
      }
    }
    const twUrl = document.querySelector('meta[property="twitter:url"]');
    if (twUrl) {
      twUrl.setAttribute("content", currentUrl);
    }

    let canonicalUrl = canonical;
    if (!canonicalUrl) {
      try {
        const url = new URL(currentUrl);
        canonicalUrl = `${url.origin}${url.pathname}`;
      } catch {
        canonicalUrl = currentUrl;
      }
    }
    let canonicalTag = document.querySelector('link[rel="canonical"]');
    if (!canonicalTag) {
      canonicalTag = document.createElement("link");
      canonicalTag.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalTag);
    }
    canonicalTag.setAttribute("href", canonicalUrl);

    // Handle noindex
    let robotsTag = document.querySelector('meta[name="robots"]');
    if (noindex) {
      if (!robotsTag) {
        robotsTag = document.createElement("meta");
        robotsTag.setAttribute("name", "robots");
        document.head.appendChild(robotsTag);
      }
      robotsTag.setAttribute("content", "noindex");
    } else {
      // Create or update to "index, follow" to be explicit, but removing noindex is key
      if (robotsTag) {
        // Optionally remove it or set to index, follow.
        // Removing it returns to default behavior which is index.
        // However, if we want to force index we can set it.
        // Let's just remove "noindex" if it was set by this component previously,
        // or set to "index, follow" if we want to be explicit.
        // Safer to just remove if we don't want to enforce index on everything.
        // But since we are SPA, cleaning up is important.
        robotsTag.setAttribute("content", "index, follow");
      }
    }

    // Handle Structured Data (JSON-LD)
    if (structuredData) {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.id = "json-ld-seo";
      script.innerHTML = JSON.stringify(structuredData);
      document.head.appendChild(script);

      return () => {
        const oldScript = document.getElementById("json-ld-seo");
        if (oldScript) {
          document.head.removeChild(oldScript);
        }
      };
    }
  }, [
    title,
    description,
    keywords,
    canonical,
    ogType,
    ogImage,
    fullTitle,
    structuredData,
    noindex,
    currentUrl,
  ]);

  return null;
};

export default SEO;
