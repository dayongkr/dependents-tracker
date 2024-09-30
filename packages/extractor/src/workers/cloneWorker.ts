import { parentPort } from 'node:worker_threads';
import { CloneInfo, cloneRepository } from '../core/repository/clone';
import { clearRepository } from '../core/repository';

type LogMessage = {
  type: 'log';
  value: string;
};

export type CloneInfoMessage = {
  type: 'data';
  value: CloneInfo & { dependent: string };
};

export type ProcessExitMessage = {
  type: 'exit';
};

type NextMessage = {
  type: 'next';
};

type DependentMessage = {
  type: 'dependent';
  value: string;
};

export type CloneOutDegreeMessage = LogMessage | CloneInfoMessage | ProcessExitMessage | NextMessage | DependentMessage;
export type CloneInDegreeMessage = {
  value: { value: { dependent: string; hash: string }[] | undefined; done?: boolean; packageName: string };
};

parentPort?.on('message', ({ value: { value, done, packageName } }: CloneInDegreeMessage) => {
  if (done || value === undefined) {
    parentPort?.postMessage({ type: 'exit' } satisfies CloneOutDegreeMessage);
    return;
  }

  for (let i = 0; i < value.length; i++) {
    const { dependent, hash: previousHash } = value[i];
    parentPort?.postMessage({ type: 'dependent', value: dependent } satisfies CloneOutDegreeMessage);

    // Skip the package itself or a forked repository of the package
    if (dependent.endsWith(`/${packageName}`)) {
      parentPort?.postMessage({
        type: 'log',
        value: `Skip (${dependent}): This is the package itself or a forked repository`,
      } satisfies CloneOutDegreeMessage);
      continue;
    }

    try {
      const { repositoryDirname, hash, hit } = cloneRepository(dependent, previousHash);

      // Skip the repository if the hash is the same as the previous one
      if (hit) {
        clearRepository(repositoryDirname);

        parentPort?.postMessage({
          type: 'log',
          value: `Skip (${dependent}): Hit the cache`,
        } satisfies CloneOutDegreeMessage);
        continue;
      }

      parentPort?.postMessage({
        type: 'data',
        value: { dependent, repositoryDirname, hash, hit },
      } satisfies CloneOutDegreeMessage);
    } catch (error) {
      // Skip the repository if an error occurred
      if (error instanceof Error) {
        parentPort?.postMessage({
          type: 'log',
          value: `Failed to clone (${dependent}): ${error.message}`,
        } satisfies CloneOutDegreeMessage);
      }
    }
  }

  // All the repositories are processed and the next batch is requested
  parentPort?.postMessage({ type: 'next' } satisfies CloneOutDegreeMessage);
});
