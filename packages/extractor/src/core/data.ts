import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

export type Result = {
  [key: string]: {
    imports: {
      filename: string;
      specifiers: string[];
    }[];
    hash: string;
  };
};

export function loadData(filename: string): Result {
  if (!filename || existsSync(resolve(process.cwd(), filename))) {
    console.log('No data file found');
    return {};
  }

  const rawData = readFileSync(resolve(process.cwd(), filename), { encoding: 'utf-8' });
  const data = JSON.parse(rawData);

  console.log(`Loaded data(${Object.keys(data).length}) from ${filename}`);

  return data;
}

export function saveData(filename: string, data: Result): void {
  writeFileSync(resolve(process.cwd(), filename), JSON.stringify(data), { encoding: 'utf-8' });
}
