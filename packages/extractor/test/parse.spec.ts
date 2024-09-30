import { describe, expect, it } from 'vitest';
import { getImportDeclarations, getImportSpecifiers } from '../src/core/parse';

describe('getImportDeclarations', () => {
  const lines = [
    'import defaultExport from "module-name";',
    'import * as name from "module-name";',
    'import { export1 } from "module-name";',
    'import { export1 as alias1 } from "module-name";',
    'import { default as alias } from "module-name";',
    'import { export1, export2 } from "module-name";',
    'import { export1, export2 as alias2, /* … */ } from "module-name";',
    'import defaultExport, { export1, /* … */ } from "module-name";',
    'import defaultExport, * as name from "module-name";',
    'import "module-name";',
  ];

  const linesInOneString = `import defaultExport from "module-name";
import * as name from "module-name";
import { export1 } from "module-name";
import { export1 as alias1 } from "module-name";
import { default as alias } from "module-name";
import { export1, export2 } from "module-name";
import { export1, export2 as alias2, /* … */ } from "invalid";
import defaultExport, { export1, /* … */ } from "module-name";
import defaultExport, * as name from "invalid";
import "module-name";
* import { * as lodash } from 'module-name';
  `;

  lines.forEach((line) => {
    it(`should get import lines for ${line}`, () => {
      const matches = getImportDeclarations(line, 'module-name');
      if (matches === null) {
        throw new Error('No matches found');
      }
      expect(matches[0]).toBe(line.slice(0, -2));
    });
  });

  it('should get import lines for all lines in one string', () => {
    const matches = getImportDeclarations(linesInOneString, 'module-name');
    if (matches === null) {
      throw new Error('No matches found');
    }
    expect(matches).toHaveLength(8);
  });
});

describe('getImportSpecifiers', () => {
  it('should get import specifiers', () => {
    expect(getImportSpecifiers('import { export1 } from "module-name";')).toEqual(['export1']);
    expect(getImportSpecifiers('import { export1 as alias1 } from "module-name";')).toEqual(['export1']);
    expect(getImportSpecifiers('import { default as alias } from "module-name";')).toEqual(['default']);
    expect(getImportSpecifiers('import { export1, export2 } from "module-name";')).toEqual(['export1', 'export2']);
    expect(getImportSpecifiers('import { export1, export2 as alias2, /* … */ } from "module-name";')).toEqual([
      'export1',
      'export2',
    ]);
    expect(getImportSpecifiers('import defaultExport, { export1, /* … */ } from "module-name";')).toEqual(['export1']);
    expect(getImportSpecifiers('import { cloneDeep as _cloneDeep, } from "module";')).toEqual(['cloneDeep']);
    expect(getImportSpecifiers('import {clone,cloneDeep,} from "module";')).toEqual(['clone', 'cloneDeep']);
  });

  it('should return empty array for invalid import lines', () => {
    expect(getImportSpecifiers('import * as name from "module-name";')).toEqual([]);
    expect(getImportSpecifiers('import defaultExport from "module-name";')).toEqual([]);
    expect(getImportSpecifiers('import defaultExport, * as name from "module-name";')).toEqual([]);
    expect(getImportSpecifiers('import "module-name";')).toEqual([]);
    expect(getImportSpecifiers('import { * as lodash } from "module-name";')).toEqual([]);
    expect(
      getImportSpecifiers('import { ${renderNamedImports(currentSupportedFunctions)} } from "module-name;')
    ).toEqual([]);
  });
});
