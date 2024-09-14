export function getImportDeclarations(line: string, packageName: string): ReturnType<typeof String.prototype.match> {
  const regex = new RegExp(`import[^'"]*['"]${packageName}`, 'gs');
  return line.match(regex);
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
