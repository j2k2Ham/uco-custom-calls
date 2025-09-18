import React from 'react';

// Escapes regex special characters in a string
function escapeRegex(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Splits text and wraps matching query tokens in a <mark> element.
 * - Case-insensitive token match
 * - Preserves original casing of matched segments
 * - Returns string if no query or tokens
 */
export function highlightTokens(text: string, query: string) {
  const q = query.trim();
  if (!q) return text;
  const parts = q.split(/\s+/).filter(Boolean).map(p => p.toLowerCase());
  if (!parts.length) return text;
  const regex = new RegExp(`(${parts.map(escapeRegex).join('|')})`, 'ig');
  return text.split(regex).map((seg, i) => {
    const lower = seg.toLowerCase();
    if (parts.includes(lower)) {
      return <mark key={seg + '_' + i} className="bg-brass/60 text-black px-0.5 rounded-sm">{seg}</mark>;
    }
    return <React.Fragment key={seg + '_' + i}>{seg}</React.Fragment>;
  });
}
