import { readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function browseRepository<F extends (source: string) => any>(
  repositoryDirname: string,
  sourceHandler: F
): { filename: string; result: ReturnType<F> }[] {
  const stack = readdirSync(repositoryDirname, { withFileTypes: true });
  const excludes = ['node_modules', '.git'];
  const results = [];

  while (stack.length > 0) {
    const entry = stack.pop();

    if (entry == null || excludes.some((exclude) => entry.name.includes(exclude))) {
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
          results.push({ filename: resolve(entry.parentPath.replace(repositoryDirname, ''), entry.name), result });
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
