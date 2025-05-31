import { useEffect } from "react";

interface SEOHeadProps {
  title: string;
  description: string;
  canonical?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: string;
  structuredData?: object;
  author?: string;
  robots?: string;
}

export function SEOHead({ 
  title, 
  description, 
  canonical, 
  keywords, 
  ogImage = "https://pookai.com/og-image.png",
  ogType = "website",
  structuredData,
  author = "PookAi Team",
  robots = "index, follow"
}: SEOHeadProps) {
  useEffect(() => {
    // Update document title
    document.title = title;

    // Helper function to update or create meta tags
    const updateMetaTag = (name: string, content: string, attribute: string = 'name') => {
      const selector = `meta[${attribute}="${name}"]`;
      let meta = document.querySelector(selector);
      if (meta) {
        meta.setAttribute('content', content);
      } else {
        meta = document.createElement('meta');
        meta.setAttribute(attribute, name);
        meta.setAttribute('content', content);
        document.head.appendChild(meta);
      }
    };

    // Basic meta tags
    updateMetaTag('description', description);
    updateMetaTag('author', author);
    updateMetaTag('robots', robots);
    updateMetaTag('viewport', 'width=device-width, initial-scale=1.0');
    
    if (keywords) {
      updateMetaTag('keywords', keywords);
    }

    // Open Graph meta tags
    updateMetaTag('og:title', title, 'property');
    updateMetaTag('og:description', description, 'property');
    updateMetaTag('og:type', ogType, 'property');
    updateMetaTag('og:image', ogImage, 'property');
    updateMetaTag('og:site_name', 'PookAi - AI Email Concierge', 'property');
    updateMetaTag('og:locale', 'en_US', 'property');
    
    if (canonical) {
      updateMetaTag('og:url', canonical, 'property');
    }

    // Twitter Card meta tags
    updateMetaTag('twitter:card', 'summary_large_image', 'name');
    updateMetaTag('twitter:site', '@PookAi', 'name');
    updateMetaTag('twitter:creator', '@PookAi', 'name');
    updateMetaTag('twitter:title', title, 'name');
    updateMetaTag('twitter:description', description, 'name');
    updateMetaTag('twitter:image', ogImage, 'name');

    // Additional meta tags for better SEO
    updateMetaTag('theme-color', '#2563eb', 'name');
    updateMetaTag('msapplication-TileColor', '#2563eb', 'name');
    updateMetaTag('apple-mobile-web-app-capable', 'yes', 'name');
    updateMetaTag('apple-mobile-web-app-status-bar-style', 'default', 'name');
    updateMetaTag('apple-mobile-web-app-title', 'PookAi', 'name');

    // Canonical URL
    if (canonical) {
      let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      if (link) {
        link.href = canonical;
      } else {
        link = document.createElement('link');
        link.rel = 'canonical';
        link.href = canonical;
        document.head.appendChild(link);
      }
    }

    // Structured data (JSON-LD)
    if (structuredData) {
      let script = document.querySelector('script[type="application/ld+json"]');
      if (script) {
        script.textContent = JSON.stringify(structuredData);
      } else {
        script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(structuredData);
        document.head.appendChild(script);
      }
    }

  }, [title, description, canonical, keywords, ogImage, ogType, structuredData, author, robots]);

  return null;
}