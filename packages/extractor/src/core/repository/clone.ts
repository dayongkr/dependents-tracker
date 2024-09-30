import { execSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { randomUUID } from 'node:crypto';

export type CloneInfo = {
  repositoryDirname: string;
  hash: string;
  hit: boolean;
};

export function cloneRepository(fullname: string, previousHash: string): CloneInfo {
  const tempDirname = resolve(process.cwd(), './.temp-dependents-extractor', `./${randomUUID()}`);
  const repositoryName = fullname.split('/')[1];
  const repositoryDirname = resolve(tempDirname, `./${repositoryName}`);

  mkdirSync(tempDirname, { recursive: true });

  // At first, we clone the repository only with the .git directory and a recent commit.
  execSync(`git clone https://github.com/${fullname}.git --depth=1 --no-checkout --filter=blob:none`, {
    stdio: 'ignore', // ignore stdout and stderr
    cwd: tempDirname,
  });

  const headHash = execSync('git rev-parse HEAD', {
    cwd: repositoryDirname,
    encoding: 'utf-8',
  }).trim();

  // If the head hash is the same as the previous one, we don't need to checkout the repository.
  if (headHash === previousHash) {
    return { repositoryDirname, hash: headHash, hit: true };
  }

  execSync(`git checkout`, {
    stdio: 'ignore',
    cwd: repositoryDirname,
  });

  return { repositoryDirname, hash: headHash, hit: false };
}
