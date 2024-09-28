#!/usr/bin/env node

import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { Worker } from 'node:worker_threads';
import { generateDependents } from '../core/scrape';
import type { CloneInDegreeMessage, CloneOutDegreeMessage } from '../workers/cloneWorker';
import type { ParseInDegreeMessage, ParseOutDegreeMessage } from '../workers/parseWorker';

const target = process.argv[2];
const [user, packageName] = target.split('/');

const result: {
  [key: string]: {
    imports: {
      filename: string;
      specifiers: string[];
    }[];
    hash: string;
  };
} = {};

const dependents = generateDependents(user, packageName);

const cloneWorker = new Worker(resolve(import.meta.dirname, './workers/cloneWorker.js'));
const parseWorker = new Worker(resolve(import.meta.dirname, './workers/parseWorker.js'));

cloneWorker.on('message', async (message: CloneOutDegreeMessage) => {
  switch (message.type) {
    case 'log':
      console.log(message.value);
      return;
    case 'exit':
      cloneWorker.terminate();
      parseWorker.postMessage({ type: 'exit' } satisfies ParseInDegreeMessage);
      return;
    case 'data':
      parseWorker.postMessage({
        type: 'data',
        value: { ...message.value, packageName },
      } satisfies ParseInDegreeMessage);
      return;
    case 'next':
      cloneWorker.postMessage({ value: { ...(await dependents.next()), packageName } } satisfies CloneInDegreeMessage);
      return;
  }
});

parseWorker.on('message', async ({ value }: ParseOutDegreeMessage) => {
  console.log(`Done (${value.dependent})`);

  result[value.dependent] = {
    imports: value.imports,
    hash: value.hash,
  };

  writeFileSync(resolve(process.cwd(), './result.json'), JSON.stringify(result), {
    encoding: 'utf-8',
  });
});

// Start the process
cloneWorker.postMessage({ value: { ...(await dependents.next()), packageName } } satisfies CloneInDegreeMessage);
