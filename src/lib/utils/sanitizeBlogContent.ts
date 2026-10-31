
import DOMPurify from 'isomorphic-dompurify';

const allowedTags = [
  // Headings
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',

  // Text
  'p', 'br', 'hr',
  'strong', 'b', 'em', 'i', 'u', 's',
  'del', 'sub', 'sup',

  // Lists
  'ul', 'ol', 'li',

  // Links and images
  'a', 'img',

  // Quotes and code
  'blockquote', 'pre', 'code',

  // Tables
  'table', 'thead', 'tbody', 'tfoot',
  'tr', 'th', 'td',

  // Image captions
  'figure', 'figcaption',
];

const allowedAttributes = [
  'href',
  'src',
  'alt',
  'title',
  'width',
  'height',
  'target',
  'rel',
  'class',
  'start',
  'colspan',
  'rowspan',
  'scope',
];

export const sanitizeBlogContent = (html: string): string => {
  if (typeof html !== 'string' || !html.trim()) {
    return '';
  }

  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: allowedTags,
    ALLOWED_ATTR: allowedAttributes,

    FORBID_TAGS: [
      'script',
      'style',
      'iframe',
      'object',
      'embed',
    ],

    FORBID_ATTR: [
      'onclick',
      'onerror',
      'onload',
    ],

    ALLOW_DATA_ATTR: false,

    ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto|tel):|data:image\/(?:png|gif|jpe?g|webp);base64,)/i,
  });
};

// Extract plain text from sanitized HTML
export const getPlainTextFromHtml = (html: string): string => {
  const cleanHtml = sanitizeBlogContent(html);

  const fragment = DOMPurify.sanitize(cleanHtml, {
    RETURN_DOM_FRAGMENT: true,
  });

  return (fragment.textContent || '')
    .replace(/\s+/g, ' ')
    .trim();
};

// Generate SEO description from HTML
export const generateSeoDescription = (
  html: string,
  maxLength: number = 150
): string => {
  const plainText = getPlainTextFromHtml(html);

  return plainText.length > maxLength
    ? `${plainText.substring(0, maxLength)}...`
    : plainText;
};
