import { parentPort } from 'node:worker_threads';
import { CloneInfo, cloneRepository } from '../core/repository/clone';

type LogMessage = {
  type: 'log';
  value: string;
};

type CloneInfoMessage = {
  type: 'data';
  value: CloneInfo & { dependent: string };
};

type ProcessExitMessage = {
  type: 'exit';
};

type NextMessage = {
  type: 'next';
};

export type CloneOutDegreeMessage = LogMessage | CloneInfoMessage | ProcessExitMessage | NextMessage;
export type CloneInDegreeMessage = { value: { value: string[] | undefined; done?: boolean; packageName: string } };

parentPort?.on('message', ({ value: { value, done, packageName } }: CloneInDegreeMessage) => {
  if (done || value === undefined) {
    parentPort?.postMessage({ type: 'exit' } satisfies CloneOutDegreeMessage);
    return;
  }

  for (let i = 0; i < value.length; i++) {
    const dependent = value[i];
    if (dependent.endsWith(`/${packageName}`)) {
      parentPort?.postMessage({
        type: 'log',
        value: `Skip (${dependent}): This is the package itself or a forked repository`,
      } satisfies CloneOutDegreeMessage);
      continue;
    }

    try {
      const cloned = cloneRepository(dependent);

      parentPort?.postMessage({
        type: 'data',
        value: { ...cloned, dependent },
      } satisfies CloneOutDegreeMessage);
    } catch (error) {
      if (error instanceof Error) {
        parentPort?.postMessage({
          type: 'log',
          value: `Failed to clone (${dependent}): ${error.message}`,
        } satisfies CloneOutDegreeMessage);
      }
    }
  }

  parentPort?.postMessage({ type: 'next' } satisfies CloneOutDegreeMessage);
});
