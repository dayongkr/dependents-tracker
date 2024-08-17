export async function getDependents(repositoryOwner: string, repositoryName: string) {
  let fetchUrl: string | null = `https://github.com/${repositoryOwner}/${repositoryName}/network/dependents`;
  const dependents: { owner: string; name: string }[] = [];

  while (fetchUrl != null) {
    const dependentsPageRes = await fetch(fetchUrl);

    if (!dependentsPageRes.ok) {
      throw new Error('Failed to fetch dependents page');
    }

    const dependentsFirstPageText = (await dependentsPageRes.text()).trim();
    const dependentsElements = dependentsFirstPageText.split('data-test-id="dg-repo-pkg-dependent"').slice(1);

    for (const element of dependentsElements) {
      const match = element.match(/href="\/([^\/]+)\/([^\/]+)"/);

      if (!match) {
        throw new Error('Failed to parse dependent element');
      }

      dependents.push({
        owner: match[1],
        name: match[2],
      });
    }

    const matchedUrl = dependentsFirstPageText.match(
      /href="https:\/\/github\.com\/[A-Za-z0-9_-]+\/[A-Za-z0-9_-]+\/network\/dependents\?dependents_after=[A-Za-z0-9]+"/
    );

    fetchUrl = matchedUrl ? matchedUrl[0].slice(6, -1) : null;
  }

  return dependents;
}
