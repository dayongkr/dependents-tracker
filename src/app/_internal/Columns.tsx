'use client';

import type { ColumnDef } from '@tanstack/react-table';

export type Dependents = {
  specifier: string;
  repository: string;
  filename: string;
};

export const Columns: ColumnDef<Dependents>[] = [
  {
    accessorKey: 'specifier',
    header: 'Specifier',
  },
  {
    accessorKey: 'repository',
    header: 'Repository',
  },
  {
    accessorKey: 'filename',
    header: 'Filename',
  },
  {
    accessorKey: 'hash',
    header: 'Hash',
  },
  {
    accessorKey: 'branch',
    header: 'Branch',
  },
];
