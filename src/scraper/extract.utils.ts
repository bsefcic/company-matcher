import * as cheerio from 'cheerio';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

export function extractPhones(html: string): string[] {
  const $ = cheerio.load(html);
  const text = $('body').text();
  const regex = /(?:\+?\d[\s-]*){7,15}/g;
  const rawPhones = text.match(regex) ?? [];
  return rawPhones
    .map(raw => parsePhoneNumberFromString(raw, 'US')) // default region, refine later
    .filter(Boolean)
    .map(p => p!.format('E.164'));
}

export function extractSocialLinks(html: string): string[] {
  const $ = cheerio.load(html);
  return $('a[href]')
    .toArray()
    .map(el => $(el).attr('href')!)
    .filter(href => /facebook\.com|linkedin\.com|twitter\.com|instagram\.com|tiktok\.com/.test(href));
}
