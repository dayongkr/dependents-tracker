import dependentsData from '@public/data.json';
export function getDependents() {
  const entires = Object.entries(dependentsData)
    .map(([key, value]) => ({
      repository: key,
      ...value,
    }))
    .map((item) =>
      item.imports
        .map((imported) =>
          imported.specifiers.map((specifier) => ({
            specifier,
            repository: item.repository,
            filename: imported.filename,
            hash: item.hash,
            branch: item.branch,
          }))
        )
        .flat()
    )
    .flat();

  return entires;
}
