import { describe, it, expect } from 'vitest';
import { weakEtag, strongEtag } from './etag';

describe('etag helpers', () => {
  it('weakEtag returns weak validator format', () => {
    const tag = weakEtag('hello');
    expect(tag.startsWith('W/"')).toBe(true);
  });

  it('weakEtag is stable for same input', () => {
    expect(weakEtag('same')).toBe(weakEtag('same'));
  });

  it('strongEtag returns quoted hash', async () => {
    const tag = await strongEtag('hello');
    expect(tag.startsWith('"') && tag.endsWith('"')).toBe(true);
    expect(tag.length).toBeGreaterThan(6);
  });

  it('strongEtag differs from weakEtag', async () => {
    const w = weakEtag('diff');
    const s = await strongEtag('diff');
    expect(w).not.toBe(s);
  });
});
