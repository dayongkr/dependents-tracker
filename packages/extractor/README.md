# @dependents-tracker/extractor

The CLI tool collects dependents information for a given repository as follows:

- Collects the dependents of a given repository from the GitHub Dependents Page.
- Collects the import statements from the source code of the dependents repositories.

Finally, it generates a JSON file with the following structure:

```json
{
  "repository_name": {
    "imports": [
      {
        "filename": "/path/to/file",
        "specifiers": ["imported_module", "imported_module2"]
      }
    ],
    "hash": "3d129uasf...",
  }
  ...
}
```

One more thing to note is that it can collect javascript projects that use the ESM-style imports, which means that it does not collect the CommonJS-style imports or python projects, etc. It also can't collect the default imports.

```javascript
// OK
import { foo } from 'bar';

// NOT OK
const foo = require('bar');
import foo from 'bar';
```

And it runs in concurrent mode, so it can collect the dependents faster.

## Prerequisites

- `git` installed on your machine.
- `node` installed on your machine.
- `npm` installed on your machine.

## Usage

```bash
npx @dependents-tracker/extractor <repository_name> [<file_path of `result.json`>]
```

At now, the CLI tool only supports above command. The `repository_name` should be in the format of `owner/repo`. And If you have a previously generated `result.json` file, you can pass the file path as the second argument. Then the CLI tool will use the existing data and only collect the new dependents.

After running the command, the CLI tool will generate a JSON file in the current directory with the name `result.json`.

> Note: This project is still under development, so there might be some bugs or issues. If you encounter any, please report them.
