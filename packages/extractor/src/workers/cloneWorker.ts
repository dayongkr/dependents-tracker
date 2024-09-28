import { parentPort } from 'node:worker_threads';
import { CloneInfo, cloneRepository } from '../core/repository/clone';

type LogMessage = {
  type: 'log';
  value: string;
  done?: never;
};

type CloneInfoMessage = {
  type: 'data';
  value: CloneInfo & { dependent: string };
  done?: boolean;
};

type ProcessExitMessage = {
  type: 'exit';
  value?: never;
  done?: never;
};

export type CloneOutDegreeMessage = LogMessage | CloneInfoMessage | ProcessExitMessage;
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

    parentPort?.postMessage({ type: 'log', value: `Start cloning ${dependent}` } satisfies CloneOutDegreeMessage);

    const cloned = cloneRepository(dependent);

    parentPort?.postMessage({ type: 'log', value: `Cloned (${dependent})` } satisfies CloneOutDegreeMessage);
    parentPort?.postMessage({
      type: 'data',
      value: { ...cloned, dependent },
      done: i === value.length - 1,
    } satisfies CloneOutDegreeMessage);
  }
});
