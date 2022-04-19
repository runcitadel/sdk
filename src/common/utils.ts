/**
 * Joins two URL parts together and makes sure no / is duplicated/missing
 * @param url1 The first URL part
 * @param url2 The second URL part
 * @returns The joined URL
 */
export function joinUrl(url1: string, url2: string): string {
  url2 = url1.endsWith('/') && url2.startsWith('/') ? url2.substring(1) : url2;
  const separator = url1.endsWith('/') || url2.startsWith('/') ? '' : '/';
  return url1 + separator + url2;
}
