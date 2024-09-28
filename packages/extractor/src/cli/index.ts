#!/usr/bin/env node

import { writeFileSync } from 'node:fs';
import { getImportDeclarations, getImportSpecifiers } from '../core/parse';
import { browseRepository } from '../core/repository/browse';
import { clearRepository } from '../core/repository/clear';
import { cloneRepository } from '../core/repository/clone';
import { resolve } from 'node:path';
import { generateDependents } from '../core/scrape';

const target = process.argv[2];
const [user, packageName] = target.split('/');

const result: {
  [key: string]: {
    imports: {
      filename: string;
      specifiers: string[];
    }[];
    hash: string;
  };
} = {};

for await (const dependent of generateDependents(user, packageName)) {
  const filteredDependents = dependent.filter((dep) => dep !== `${user}/${packageName}`);

  for (const [index, dependent] of filteredDependents.entries()) {
    const { repositoryDirname, hash, hit } = cloneRepository(dependent);

    if (!hit) {
      const importData = browseRepository(repositoryDirname, ['.sh'], (source) => {
        const importDeclarations = getImportDeclarations(source, packageName);
        const importSpecifiers = importDeclarations.flatMap(getImportSpecifiers);
        return importSpecifiers;
      }).map(({ filename, result }) => ({ filename, specifiers: result }));

      result[dependent] = {
        imports: importData,
        hash,
      };
    }

    writeFileSync(resolve(process.cwd(), './result.json'), JSON.stringify(result), {
      encoding: 'utf-8',
    });
    clearRepository(repositoryDirname);

    console.log(`Done: ${index + 1}/${filteredDependents.length}`);
  }
}
