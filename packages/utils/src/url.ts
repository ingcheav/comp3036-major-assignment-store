/**
 * Converts an arbitrary string into a URL-friendly slug.
 * Lowercases the input, replaces non-alphanumeric characters with hyphens,
 * collapses consecutive hyphens into one, and strips leading/trailing hyphens.
 * @param path - The raw string to convert (e.g. a product name or page title)
 * @returns A lowercase, hyphen-separated URL slug
 * @example toUrlPath("Hello World!") // "hello-world"
 */
export function toUrlPath(path: string) {
  return path
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
