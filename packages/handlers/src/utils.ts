import { getDomain } from "tldts";

export function rewriteUrl(input: string, subdomain: string): string {
  const url = new URL(input);

  const domain = getDomain(url.hostname);

  if (!domain) {
    throw new Error(`Unable to determine registrable domain for "${url.hostname}"`);
  }

  url.hostname = `${subdomain}${domain}`;

  return url.toString();
}
