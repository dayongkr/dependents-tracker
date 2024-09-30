import { readFileSync } from 'fs';
import { resolve } from 'path';
import { describe, expect, it } from 'vitest';
import { getNextPageUrl, getRepositories } from '../src/core/scrape';

const html = readFileSync(resolve(import.meta.dirname, './assets/dependents.html'), 'utf-8');
const lastPage = readFileSync(resolve(import.meta.dirname, './assets/dependents-last-page.html'), 'utf-8');

describe('getNextPageUrl', () => {
  it('should get next page url for original html', () => {
    expect(getNextPageUrl(html, 'toss', 'es-toolkit')).toBe(
      'https://github.com/toss/es-toolkit/network/dependents?dependents_after=NDA5NDgwMDgyNzY'
    );
  });

  it('should return null for last page', () => {
    expect(getNextPageUrl(lastPage, 'toss', 'es-toolkit')).toBeNull();
  });
});

describe('getRepositories', () => {
  it('should get repositories', () => {
    expect(getRepositories(html).length).toBe(30);
  });
});
