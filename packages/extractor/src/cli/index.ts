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

cloneWorker.on('message', ({ value, type, done }: CloneOutDegreeMessage) => {
  if (type === 'log') {
    console.log(value);
    return;
  }

  if (type === 'exit') {
    console.log('All done!');
    cloneWorker.terminate();
    parseWorker.terminate();
    return;
  }

  console.log(`Start parsing ${value.dependent}`);

  parseWorker.postMessage({ value: { ...value, packageName }, done } satisfies ParseInDegreeMessage);
});

parseWorker.on('message', async ({ done, value }: ParseOutDegreeMessage) => {
  console.log(`Parsed (${value.dependent})`);

  if (done) {
    cloneWorker.postMessage({ value: { ...(await dependents.next()), packageName } } satisfies CloneInDegreeMessage);
  }

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
