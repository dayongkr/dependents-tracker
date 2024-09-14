import { type Dirent, readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

function resolveEntryName(entry: Dirent, repositoryDirname: string) {
  entry.name = resolve(repositoryDirname, entry.name); // resolve to absolute path
  return entry;
}

export function browseRepository(repositoryDirname: string, sourceHandler: (source: string) => unknown) {
  const stack = readdirSync(repositoryDirname, { withFileTypes: true }).map((entry) =>
    resolveEntryName(entry, repositoryDirname)
  );
  const excludes = ['node_modules', '.git'];
  const results = [];

  while (stack.length > 0) {
    const entry = stack.pop();
    if (entry == null || excludes.some((exclude) => entry.name.includes(exclude))) {
      continue;
    }

    if (entry.isDirectory()) {
      const subEntries = readdirSync(entry.name, { withFileTypes: true }).map((subEntry) =>
        resolveEntryName(subEntry, entry.name)
      );
      stack.push(...subEntries);
    } else {
      const source = readFileSync(entry.name, 'utf-8');
      const result = sourceHandler(source);

      if (Array.isArray(result)) {
        results.push(...result);
      } else {
        results.push(result);
      }
    }
  }
  console.log('Browsed', repositoryDirname);
  return results;
}
