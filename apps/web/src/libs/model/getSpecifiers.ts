import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { PACAKGE } from '../constants';

export type Specifier = {
  specifier: string;
  repository: string;
  filename: string;
  hash: string;
};

type DepdentsData = {
  [key: string]: {
    imports: {
      filename: string;
      specifiers: string[];
    }[];
    hash: string;
  };
};

export function getSpecifiers(): Specifier[] {
  const dependentsData: DepdentsData = JSON.parse(
    readFileSync(resolve(import.meta.dirname ?? __dirname, `../../../public/${PACAKGE}.json`), {
      encoding: 'utf-8',
    })
  );

  const specifiers = Object.entries(dependentsData)
    .map(([repository, data]) => ({ repository, ...data }))
    .map((item) =>
      item.imports.map((imported) =>
        imported.specifiers.map((specifier) => ({
          specifier,
          repository: item.repository,
          filename: imported.filename,
          hash: item.hash,
        }))
      )
    )
    .flat(2);

  return specifiers;
}
