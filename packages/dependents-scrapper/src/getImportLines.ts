import { execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';

export async function getImportLines(repositoryOwner: string, repositoryName: string, packageName = repositoryName) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const tmpDirName = path.resolve(__dirname, './.tmp');
  const repoDirName = path.resolve(tmpDirName, repositoryName);

  if (!fs.existsSync(tmpDirName)) {
    fs.mkdirSync(tmpDirName);
  }

  if (fs.existsSync(repoDirName)) {
    fs.rmSync(repoDirName, { recursive: true });
  }

  await execSync(`git clone https://github.com/${repositoryOwner}/${repositoryName}.git --depth 1`, {
    stdio: 'ignore',
    cwd: tmpDirName,
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

  return importLines;
}
