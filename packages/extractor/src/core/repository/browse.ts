import { readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function browseRepository<F extends (source: string) => any>(
  repositoryDirname: string,
  excludes: string[] = [],
  sourceHandler: F
): { filename: string; result: ReturnType<F> }[] {
  const stack = readdirSync(repositoryDirname, { withFileTypes: true });
  const defaultExcludes = [...excludes, 'node_modules', '.git'];
  const results = [];

  while (stack.length > 0) {
    const entry = stack.pop();

    // Skip the entry if it is null or matches the default excludes
    if (entry == null || defaultExcludes.some((exclude) => entry.name.includes(exclude))) {
      continue;
    }

    try {
      if (entry.isDirectory()) {
        const subEntries = readdirSync(resolve(entry.parentPath, entry.name), { withFileTypes: true });

        stack.push(...subEntries);
      } else {
        const source = readFileSync(resolve(entry.parentPath, entry.name), 'utf-8');
        const result = sourceHandler(source);

        if (result.length) {
          const path = entry.parentPath.replace(repositoryDirname, '');

          results.push({ filename: path === '' ? `/${entry.name}` : resolve(path, entry.name), result });
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Skipping ${entry.name} due to error: ${error.message}`);
      }
    }
  }

  return results;
}
