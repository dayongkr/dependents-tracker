export function getFunctions(importLines: string[]) {
  const functions: string[] = [];

  for (const line of importLines) {
    const matched = line.match(/({.*}|\*)/);
    if (!matched) {
      continue;
    }

    const functionNames = matched[0]
      .replace(/[{}]/g, '')
      .split(',')
      .map((name) => name.trim());

    if (functionNames.length > 0) {
      functions.push(...functionNames);
    }
  }

  return functions;
}
