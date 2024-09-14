export function getImportDeclarations(source: string, packageName: string): string[] {
  const regex = new RegExp(`import[^'"]*['"]${packageName}`, 'gs');
  const matches = source.match(regex);

  if (matches === null) {
    return [];
  }

  return matches;
}

export function getImportSpecifiers(importDeclaration: string): string[] {
  const regex = /{[^'"]+}/g;
  const matches = importDeclaration.match(regex);

  if (matches === null) {
    return [];
  }

  const unwrapped = matches[0].slice(1, -1);
  const specifiers = unwrapped.split(',').map((specifier) => specifier.trim().split(' ')[0]);
  const filtered = specifiers.filter((specifier) => !specifier.includes('/'));

  return filtered;
}
