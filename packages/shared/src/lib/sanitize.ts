import DOMPurify from 'dompurify';

const ALLOWED_HTML_TAGS = [
  'b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li',
  'h1', 'h2', 'h3', 'h4', 'span', 'div',
  'table', 'thead', 'tbody', 'tr', 'th', 'td',
] as const;

const ALLOWED_HTML_ATTR = ['href', 'target', 'rel', 'class'] as const;

function stripTags(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}

export function sanitizeHtml(dirty: string): string {
  if (typeof window === 'undefined') {
    return stripTags(dirty);
  }
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [...ALLOWED_HTML_TAGS],
    ALLOWED_ATTR: [...ALLOWED_HTML_ATTR],
    FORBID_ATTR: ['style', 'onerror', 'onload', 'onclick'],
  });
}

export function sanitizeText(dirty: string): string {
  if (typeof window === 'undefined') {
    return stripTags(dirty);
  }
  return DOMPurify.sanitize(dirty, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
}
