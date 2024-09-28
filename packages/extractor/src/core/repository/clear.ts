import { rmSync } from 'node:fs';
import { resolve } from 'node:path';

export function clearRepository(repositoryDirname: string) {
  rmSync(resolve(repositoryDirname, '../'), { recursive: true });
}
