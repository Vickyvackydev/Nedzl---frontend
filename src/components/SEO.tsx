import { useEffect } from "react";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogType?: string;
  ogImage?: string;
  structuredData?: object;
}

const SEO = ({
  title,
  description,
  keywords,
  canonical,
  ogType = "website",
  ogImage,
  structuredData,
}: SEOProps) => {
  const baseTitle = "Nedzl.com – The Ultimate Student Marketplace";
  const fullTitle = title ? `${title} | ${baseTitle}` : baseTitle;

  useEffect(() => {
    // Update Title
    document.title = fullTitle;

    // Update Meta Description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        description ||
          "Buy & Sell Used Items Easily on Nedzl.com – The trusted student-focused e-commerce platform across Nigeria."
      );
    }

    // Update Meta Keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute(
        "content",
        keywords ||
          "student marketplace, buy used items, sell used items, university students Nigeria, Nedzl"
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
          "The trusted student-focused e-commerce platform built to connect university students across Nigeria."
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

    // Update Canonical
    if (canonical) {
      const canonicalTag = document.querySelector('link[rel="canonical"]');
      if (canonicalTag) {
        canonicalTag.setAttribute("href", canonical);
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
  ]);

  return null;
};

export default SEO;
