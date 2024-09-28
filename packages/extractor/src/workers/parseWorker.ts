import { parentPort } from 'node:worker_threads';
import { getImportDeclarations, getImportSpecifiers } from '../core/parse';
import { browseRepository, clearRepository } from '../core/repository';

export type ParseOutDegreeMessage = {
  value: { imports: { filename: string; specifiers: string[] }[]; hash: string; dependent: string };
  done?: boolean;
};
export type ParseInDegreeMessage = {
  value: { dependent: string; packageName: string; repositoryDirname: string; hash: string; hit: boolean };
  done?: boolean;
};

parentPort?.on(
  'message',
  ({ value: { dependent, packageName, repositoryDirname, hash, hit }, done }: ParseInDegreeMessage) => {
    if (!hit) {
      const importData = browseRepository(repositoryDirname, ['.sh'], (source) => {
        const importDeclarations = getImportDeclarations(source, packageName);
        const importSpecifiers = importDeclarations.flatMap(getImportSpecifiers);
        return importSpecifiers;
      }).map(({ filename, result }) => ({ filename, specifiers: result }));

      clearRepository(repositoryDirname);

      parentPort?.postMessage({
        value: { imports: importData, hash, dependent },
        done,
      } satisfies ParseOutDegreeMessage);
    }
  }
);
