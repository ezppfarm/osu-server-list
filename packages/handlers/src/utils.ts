export function rewriteUrl(input: string, subdomain: string): string {
  const url = new URL(input);

  const parts = url.hostname.split(".");

  // Keep the root domain
  const root = parts.slice(-2).join(".");

  url.hostname = `${subdomain}${root}`;

  return url.toString();
}
