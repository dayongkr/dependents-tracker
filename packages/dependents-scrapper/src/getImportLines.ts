import { execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';

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
