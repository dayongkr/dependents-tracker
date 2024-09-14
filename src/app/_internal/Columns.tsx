'use client';

import { Button } from '@/components/shadcn/button';
import type { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';

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
