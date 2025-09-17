export function weakEtag(input: string) {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 31 + input.charCodeAt(i)) >>> 0;
  }
  return 'W/"' + hash.toString(16) + '"';
}

export async function strongEtag(input: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const digest = await crypto.subtle.digest('SHA-256', data);
  const bytes = Array.from(new Uint8Array(digest)).slice(0, 12); // truncate for brevity
  const hex = bytes.map(b => b.toString(16).padStart(2, '0')).join('');
  return '"' + hex + '"';
}
