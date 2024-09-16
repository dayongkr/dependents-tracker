import dependentsData from '@public/data.json';

export type Specifier = {
  specifier: string;
  repository: string;
  filename: string;
  hash: string;
  branch: string;
};

export function getSpecifiers(): Specifier[] {
  const specifiers = Object.entries(dependentsData)
    .map(([repository, data]) => ({ repository, ...data }))
    .map((item) =>
      item.imports.map((imported) =>
        imported.specifiers.map((specifier) => ({
          specifier,
          repository: item.repository,
          filename: imported.filename,
          hash: item.hash,
          branch: item.branch,
        }))
      )
    )
    .flat(2);

  return specifiers;
}
