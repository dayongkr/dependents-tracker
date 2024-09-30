#!/usr/bin/env node
import { resolve } from 'node:path';
import { Worker } from 'node:worker_threads';
import { loadData, Result, saveData } from '../core/data';
import { generateDependents } from '../core/scrape';
import type { CloneInDegreeMessage, CloneOutDegreeMessage } from '../workers/cloneWorker';
import type { ParseInDegreeMessage, ParseOutDegreeMessage } from '../workers/parseWorker';

const target = process.argv[2];
const dataFilename = process.argv[3];

if (!target) {
  console.error('Please provide the target repository');
  console.error('Usage: npx dependents-extractor <target>');
  process.exit(1);
}

const [user, packageName] = target.split('/');

const result: Result = loadData(dataFilename);
const dependents = generateDependents(user, packageName, result);
const dependentsSet = new Set<string>();

const cloneWorker = new Worker(resolve(import.meta.dirname, './workers/cloneWorker.js'));
const parseWorker = new Worker(resolve(import.meta.dirname, './workers/parseWorker.js'));

cloneWorker.on('message', async (message: CloneOutDegreeMessage) => {
  switch (message.type) {
    case 'dependent':
      dependentsSet.add(message.value);
      return;
    case 'log':
      console.log(message.value);
      return;
    case 'data':
      // Send the data to the parse worker
      parseWorker.postMessage({
        type: 'data',
        value: { ...message.value, packageName },
      } satisfies ParseInDegreeMessage);
      return;
    case 'next':
      // Get the next batch of dependents from the generator and send them to the clone worker
      cloneWorker.postMessage({ value: { ...(await dependents.next()), packageName } } satisfies CloneInDegreeMessage);
      return;
    case 'exit':
      for (const key of Object.keys(result)) {
        // Remove the data of the repositories that are not in the dependents set
        if (!dependentsSet.has(key)) {
          delete result[key];
        }
      }

      saveData(dataFilename, result);
      // For graceful termination (using event loop)
      parseWorker.postMessage({ type: 'exit' } satisfies ParseInDegreeMessage);
      cloneWorker.terminate();
      return;
  }
});

parseWorker.on('message', async ({ value }: ParseOutDegreeMessage) => {
  console.log(`Done (${value.dependent})`);

  result[value.dependent] = {
    imports: value.imports,
    hash: value.hash,
  };
});

// Start the process
cloneWorker.postMessage({ value: { ...(await dependents.next()), packageName } } satisfies CloneInDegreeMessage);
