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

for await (const dependents of generateDependents(user, packageName)) {
  for (const [index, dependent] of dependents.entries()) {
    if (dependent.endsWith(`/${packageName}`)) {
      console.log(`Skip (${dependent}): This is the package itself or a fork`);
      continue;
    }

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

    console.log(`Done (${dependent}): ${index + 1}/${dependents.length}`);
  }
}
