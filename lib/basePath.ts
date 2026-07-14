export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

/** Prefixes a root-relative static asset path with basePath for GitHub Pages. */
export function assetPath(path: string): string {
  return `${BASE_PATH}${path}`;
}
