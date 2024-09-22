#!/usr/bin/env node

import { writeFileSync } from 'node:fs';
import { getImportDeclarations, getImportSpecifiers } from '../core/parse';
import { browseRepository } from '../core/repository/browse';
import { clearRepository } from '../core/repository/clear';
import { cloneRepository } from '../core/repository/clone';
import { resolve } from 'node:path';
import { getDependents } from '../core/scrape';

const target = process.argv[2];
const [user, packageName] = target.split('/');
const dependents = await getDependents(user, packageName);
const filteredDependents = dependents.filter((dependent) => dependent !== `${user}/${packageName}`);

const result: {
  [key: string]: {
    imports: {
      filename: string;
      specifiers: string[];
    }[];
    hash: string;
    branch: string;
  };
} = {};

for (const [index, dependent] of filteredDependents.entries()) {
  const { repositoryDirname, hash, branch, hit } = cloneRepository(dependent);

  if (!hit) {
    const importData = browseRepository(repositoryDirname, ['.sh'], (source) => {
      const importDeclarations = getImportDeclarations(source, packageName);
      const importSpecifiers = importDeclarations.flatMap(getImportSpecifiers);
      return importSpecifiers;
    }).map(({ filename, result }) => ({ filename, specifiers: result }));

    result[dependent] = {
      imports: importData,
      hash,
      branch,
    };
  }

  writeFileSync(resolve(process.cwd(), './result.json'), JSON.stringify(result), {
    encoding: 'utf-8',
  });
  clearRepository(repositoryDirname);

  console.log(`Done: [${index + 1}/${dependents.length}] ${dependent}`);
}
