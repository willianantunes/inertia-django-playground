import { Head } from "@inertiajs/react";
import type { ReactNode } from "react";

export interface SEOProps {
  /** Page title - will be used for both <title> and og:title */
  title?: string;
  /** Page description - will be used for both meta description and og:description */
  description?: string;
  /** Canonical URL of the page */
  url?: string;
  /** URL to the image for social sharing */
  image?: string;
  /** Alt text for the social sharing image */
  imageAlt?: string;
  /** Image width in pixels */
  imageWidth?: number;
  /** Image height in pixels */
  imageHeight?: number;
  /** Type of content - defaults to 'website' */
  type?: "website" | "article" | "profile" | "book" | "product";
  /** Site name for og:site_name */
  siteName?: string;
  /** Locale for og:locale - defaults to 'en_US' */
  locale?: string;
  /** Twitter card type - defaults to 'summary_large_image' */
  twitterCard?: "summary" | "summary_large_image" | "app" | "player";
  /** Twitter @username of the website */
  twitterSite?: string;
  /** Twitter @username of the content creator */
  twitterCreator?: string;
  /** Keywords for meta keywords tag */
  keywords?: string | string[];
  /** Author of the content */
  author?: string;
  /** Robots directive - defaults to 'index, follow' */
  robots?: string;
  /** Whether to prevent indexing */
  noIndex?: boolean;
  /** Whether to prevent following links */
  noFollow?: boolean;
  /** Published date for articles (ISO 8601 format) */
  publishedTime?: string;
  /** Modified date for articles (ISO 8601 format) */
  modifiedTime?: string;
  /** Article section/category */
  section?: string;
  /** Article tags */
  tags?: string[];
  /** Additional custom children to render in Head */
  children?: ReactNode;
}

export function SEO({
  title,
  description,
  url,
  image,
  imageAlt,
  imageWidth,
  imageHeight,
  type = "website",
  siteName,
  locale = "en_US",
  twitterCard = "summary_large_image",
  twitterSite,
  twitterCreator,
  keywords,
  author,
  robots,
  noIndex = false,
  noFollow = false,
  publishedTime,
  modifiedTime,
  section,
  tags,
  children,
}: SEOProps) {
  const robotsContent =
    robots ??
    (noIndex || noFollow ? `${noIndex ? "noindex" : "index"}, ${noFollow ? "nofollow" : "follow"}` : undefined);

  const keywordsContent = Array.isArray(keywords) ? keywords.join(", ") : keywords;

  return (
    <Head title={title}>
      {/* Basic Meta Tags */}
      {description && <meta head-key="description" name="description" content={description} />}
      {keywordsContent && <meta head-key="keywords" name="keywords" content={keywordsContent} />}
      {author && <meta head-key="author" name="author" content={author} />}
      {robotsContent && <meta head-key="robots" name="robots" content={robotsContent} />}
      {url && <link head-key="canonical" rel="canonical" href={url} />}

      {/* Open Graph Tags */}
      {title && <meta head-key="og:title" property="og:title" content={title} />}
      {description && <meta head-key="og:description" property="og:description" content={description} />}
      {url && <meta head-key="og:url" property="og:url" content={url} />}
      <meta head-key="og:type" property="og:type" content={type} />
      {siteName && <meta head-key="og:site_name" property="og:site_name" content={siteName} />}
      <meta head-key="og:locale" property="og:locale" content={locale} />
      {image && <meta head-key="og:image" property="og:image" content={image} />}
      {imageAlt && <meta head-key="og:image:alt" property="og:image:alt" content={imageAlt} />}
      {imageWidth && <meta head-key="og:image:width" property="og:image:width" content={String(imageWidth)} />}
      {imageHeight && <meta head-key="og:image:height" property="og:image:height" content={String(imageHeight)} />}

      {/* Article-specific Open Graph Tags */}
      {type === "article" && publishedTime && (
        <meta head-key="article:published_time" property="article:published_time" content={publishedTime} />
      )}
      {type === "article" && modifiedTime && (
        <meta head-key="article:modified_time" property="article:modified_time" content={modifiedTime} />
      )}
      {type === "article" && section && (
        <meta head-key="article:section" property="article:section" content={section} />
      )}
      {type === "article" && author && <meta head-key="article:author" property="article:author" content={author} />}
      {type === "article" &&
        tags?.map((tag, index) => <meta key={`article:tag:${index}`} property="article:tag" content={tag} />)}

      {/* Twitter Card Tags */}
      <meta head-key="twitter:card" name="twitter:card" content={twitterCard} />
      {title && <meta head-key="twitter:title" name="twitter:title" content={title} />}
      {description && <meta head-key="twitter:description" name="twitter:description" content={description} />}
      {image && <meta head-key="twitter:image" name="twitter:image" content={image} />}
      {imageAlt && <meta head-key="twitter:image:alt" name="twitter:image:alt" content={imageAlt} />}
      {twitterSite && <meta head-key="twitter:site" name="twitter:site" content={twitterSite} />}
      {twitterCreator && <meta head-key="twitter:creator" name="twitter:creator" content={twitterCreator} />}

      {/* Additional custom elements */}
      {children}
    </Head>
  );
}

export default SEO;
