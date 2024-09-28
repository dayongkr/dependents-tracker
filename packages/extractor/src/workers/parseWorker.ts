import { parentPort } from 'node:worker_threads';
import { getImportDeclarations, getImportSpecifiers } from '../core/parse';
import { browseRepository, clearRepository } from '../core/repository';

type ExitMessage = { type: 'exit' };
type RepositoryInfoMessage = {
  type: 'data';
  value: { dependent: string; packageName: string; repositoryDirname: string; hash: string; hit: boolean };
};

export type ParseOutDegreeMessage = {
  value: { imports: { filename: string; specifiers: string[] }[]; hash: string; dependent: string };
};
export type ParseInDegreeMessage = ExitMessage | RepositoryInfoMessage;

parentPort?.on('message', (message: ParseInDegreeMessage) => {
  if (message.type === 'exit') {
    parentPort?.close();
    return;
  }
  if (!message.value.hit) {
    const { dependent, packageName, repositoryDirname, hash } = message.value;
    const importData = browseRepository(repositoryDirname, ['.sh'], (source) => {
      const importDeclarations = getImportDeclarations(source, packageName);
      const importSpecifiers = importDeclarations.flatMap(getImportSpecifiers);
      return importSpecifiers;
    }).map(({ filename, result }) => ({ filename, specifiers: result }));

    clearRepository(repositoryDirname);

    parentPort?.postMessage({
      value: { imports: importData, hash, dependent },
    } satisfies ParseOutDegreeMessage);
  }
});
