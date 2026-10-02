import DOMPurify from 'isomorphic-dompurify';

// Allowed HTML elements and attributes for Tiptap content
const allowedTags = [
  'p', 'strong', 'em', 's', 'h1', 'h2', 'h3',
  'ul', 'ol', 'li', 'blockquote', 'code', 'a'
];

// Configure DOMPurify with our allowed tags and attributes
export const sanitizeBlogContent = (html: string): string => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: allowedTags,
    ALLOWED_ATTR: ['href'],
    FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed'],
    FORBID_ATTR: ['onclick', 'onerror', 'onload'],
    ALLOWED_URI_REGEXP: /^https?:\/\//,
  });
};

// Extract plain text from sanitized HTML using proper HTML parsing
export const getPlainTextFromHtml = (html: string): string => {
  const cleanHtml = sanitizeBlogContent(html);
  
  // Use DOMPurify RETURN_DOM_FRAGMENT to parse HTML and extract textContent
  const fragment = DOMPurify.sanitize(cleanHtml, {
    RETURN_DOM_FRAGMENT: true,
  });
  
  const rawText = fragment.textContent || '';
  
  // Normalize whitespace: replace any whitespace sequence (including &nbsp; parsed as non-breaking space) with a single space
  return rawText.replace(/\s+/g, ' ').trim();
};

// Generate SEO description from HTML
export const generateSeoDescription = (html: string, maxLength: number = 150): string => {
  const plainText = getPlainTextFromHtml(html);
  return plainText.length > maxLength ? `${plainText.substring(0, maxLength)}...` : plainText;
};
