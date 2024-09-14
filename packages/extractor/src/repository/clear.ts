import fs from 'node:fs';

export function clearRepository(repositoryDirname: string) {
  fs.rmSync(repositoryDirname, { recursive: true });
  console.log(`Cleared ${repositoryDirname}`);
}
