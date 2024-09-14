import { execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';

export function cloneRepository(fullname: string): {
  repositoryDirname: string;
  hit: boolean;
} {
  const tempDirname = path.resolve(import.meta.dirname, './.temp');
  const repositoryName = fullname.split('/')[1];
  const repositoryDirname = path.resolve(import.meta.dirname, `./.temp/${repositoryName}`);

  if (!fs.existsSync(tempDirname)) {
    fs.mkdirSync(tempDirname);
  }

  if (fs.existsSync(repositoryDirname)) {
    fs.rmSync(repositoryDirname, { recursive: true });
  }

  // At first, we clone the repository only with the .git directory and a recent commit.
  execSync(`git clone https://github.com/${fullname}.git --depth=1 --no-checkout --filter=blob:none`, {
    stdio: 'ignore', // ignore stdout and stderr
    cwd: tempDirname,
  });

  // const headHash = execSync('git rev-parse HEAD', {
  //   cwd: repositoryDirname,
  //   encoding: 'utf-8',
  // }).trim();

  execSync(`git checkout`, {
    stdio: 'ignore',
    cwd: repositoryDirname,
  });

  console.log(`Cloned ${fullname} to ${repositoryDirname}`);

  return { repositoryDirname, hit: false };
}

export async function getImportLines(
  dependent: string,
  packageName: string,
  cache: { hash: string; imports: string[] }
): Promise<{ hash: string; imports: string[] }> {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const tmpDirName = path.resolve(__dirname, './.tmp');
  const dependentRepo = dependent.split('/')[1];
  const repoDirName = path.resolve(tmpDirName, dependentRepo);

  if (!fs.existsSync(tmpDirName)) {
    fs.mkdirSync(tmpDirName);
  }

  if (fs.existsSync(repoDirName)) {
    fs.rmSync(repoDirName, { recursive: true });
  }

  await execSync(`git clone https://github.com/${dependent}.git --depth=1 --no-checkout --filter=blob:none`, {
    stdio: 'ignore',
    cwd: tmpDirName,
  });

  const headHash = await execSync('git rev-parse HEAD', {
    cwd: repoDirName,
    encoding: 'utf-8',
  }).trim();

  if (cache && cache.hash === headHash) {
    return cache;
  }

  await execSync(`git checkout`, {
    stdio: 'ignore',
    cwd: repoDirName,
  });

  const fileNames = fs.readdirSync(repoDirName).map((file) => path.resolve(repoDirName, file));
  const blackList = ['node_modules', '.git', '.md', '.txt', '.spec.', '.test.', '.bench.'];
  const importRegExp = new RegExp(`(import\\s.*\\sfrom\\s)('${packageName}(\\/.*)?'|"${packageName}(\\/.*)?")`, 'g');
  const importLines = [];

  while (fileNames.length > 0) {
    const fileName = fileNames.pop();

    if (!fileName || blackList.some((black) => fileName.includes(black))) {
      continue;
    }

    const isDir = fs.lstatSync(fileName).isDirectory();
    try {
      if (isDir) {
        const subFile = fs.readdirSync(fileName).map((subFile) => path.resolve(fileName, subFile));
        fileNames.push(...subFile);
      } else {
        const fileContent = fs.readFileSync(fileName, 'utf-8');
        const matchedLines = fileContent.match(importRegExp);
        if (matchedLines) {
          importLines.push(...matchedLines);
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      if (e && e.code === 'EISDIR') {
        const subFile = fs.readdirSync(fileName).map((subFile) => path.resolve(fileName, subFile));
        fileNames.push(...subFile);
      }
    }
  }

  // remove .tmp directory
  fs.rmSync(repoDirName, { recursive: true });

  return { hash: headHash, imports: importLines };
}
