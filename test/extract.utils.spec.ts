
import {
  extractPhones,
  extractSocialLinks,
} from '../src/scraper/extract.utils';

describe('extract utils', () => {
  it('normalises US phone to E.164', () => {
    const html = '<p>Call +1 (408)-555-1234 or 408-555-4321 today!</p>';
    expect(extractPhones(html)).toEqual(['+14085551234', '+14085554321']);
  });

  it('deduplicates phones', () => {
    const html = 'Tel: 408-555-1234, phone 408-555-1234';
    expect(extractPhones(html)).toEqual(['+14085551234']);
  });

  it('pulls facebook & linkedin links', () => {
    const html = `
      <a href="https://www.facebook.com/acme">fb</a>
      <a href="linkedin.com/company/acme">li</a>`;
    expect(extractSocialLinks(html)).toEqual([
      'www.facebook.com/acme',
      'linkedin.com/company/acme',
    ]);
  });
});
