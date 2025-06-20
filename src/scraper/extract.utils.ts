import * as cheerio from 'cheerio';
import { parsePhoneNumberFromString, CountryCode } from 'libphonenumber-js';

export function extractPhones(html: string, defaultRegion: CountryCode = 'US'): string[] {
  const text = cheerio.load(html)('body').text();
  // broad pattern: sequences of digits/spaces/dashes/plus with min length 7
  const reg = /(?:\+?\d[\d\s\-().]{6,}\d)/g;
  const raw = text.match(reg) ?? [];

  const normalised = raw
    .map(r => parsePhoneNumberFromString(r, defaultRegion))
    .filter(Boolean)
    .map(p => p!.format('E.164'));

  // dedupe & return
  return [...new Set(normalised)];
}

const SOCIAL_PATTERNS =
  /(https?:\/\/)?(www\.)?(facebook|fb|linkedin|twitter|x|instagram|tiktok)\.com\/[^\s"'<>]+/gi;

export function extractSocialLinks(html: string): string[] {
  const urls = (html.match(SOCIAL_PATTERNS) ?? []).map(u =>
    // normalise scheme, strip trailing punctuation
    u.replace(/^https?:\/\//, '').replace(/[).,]+$/, ''),
  );
  return [...new Set(urls)];
}
