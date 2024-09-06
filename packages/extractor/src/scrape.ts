function minify(html: string): string {
  return html
    .split('\n')
    .map((line) => line.trim())
    .join('');
}

export function getNextPageUrl(html: string, user: string, repository: string): string | null {
  const urlPattern = `https://github.com/${user}/${repository}/network/dependents\\?dependents_after=[\\w\\d]+`;
  const lookbehindPattern = `(?<=href=")`;
  const lookaheadPattern = `(?=")`;
  const regex = new RegExp(`${lookbehindPattern}${urlPattern}${lookaheadPattern}`);

  const matched = html.match(regex);

  if (!matched) {
    return null;
  }

  return matched[0];
}

export function getRepositories(html: string): string[] {
  const repositoryPattern = `.+/.+`;
  const lookbehindPattern = `(?<=data-hovercard-type="repository" data-hovercard-url="/)`;
  const lookaheadPattern = `(?=/hovercard)`;

  const regex = new RegExp(`${lookbehindPattern}${repositoryPattern}${lookaheadPattern}`, 'g');
  const matched = html.match(regex);

  if (!matched) {
    throw new Error('Failed to get repositories');
  }

  return matched;
}

export async function getDependents(repositoryOwner: string, repositoryName: string): Promise<string[]> {
  let dependentsUrl: string | null = `https://github.com/${repositoryOwner}/${repositoryName}/network/dependents`;
  const dependents: string[] = [];

  while (dependentsUrl !== null) {
    const dependentsPageRes = await fetch(dependentsUrl);

    if (!dependentsPageRes.ok) {
      throw new Error('Failed to fetch dependents page');
    }

    const dependentsPageText = minify(await dependentsPageRes.text());
    const repositories = getRepositories(dependentsPageText);

    dependents.push(...repositories);
    dependentsUrl = getNextPageUrl(dependentsPageText, repositoryOwner, repositoryName);
  }

  return dependents;
}
