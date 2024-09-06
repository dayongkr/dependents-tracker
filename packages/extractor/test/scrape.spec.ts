import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { getDependents, getNextPageUrl, getRepositories } from '../src/scrape';

const html = readFileSync(resolve(import.meta.dirname, './assets/dependents.html'), 'utf-8');
const minified = readFileSync(resolve(import.meta.dirname, './assets/dependents.min.html'), 'utf-8');
const lastPage = readFileSync(resolve(import.meta.dirname, './assets/dependents-last-page.html'), 'utf-8');
const url = 'https://github.com/toss/es-toolkit/network/dependents?dependents_after=NDA5Njc5MzU0NjQ';

describe('getNextPageUrl', () => {
  it('should get next page url for original html', () => {
    expect(getNextPageUrl(html, 'toss', 'es-toolkit')).toBe(url);
  });

  it('should get next page url for minified html', () => {
    expect(getNextPageUrl(minified, 'toss', 'es-toolkit')).toBe(url);
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

describe('getDependents', () => {
  it('should get dependents', async () => {
    const dependents = await getDependents('toss', 'es-toolkit');
    expect(dependents.length).not.toBe(0);
  });
});
