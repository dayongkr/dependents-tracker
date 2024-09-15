'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { ExternalLink } from 'lucide-react';
import Image from 'next/image';

export type Dependents = {
  specifier: string;
  repository: string;
  filename: string;
  branch: string;
  hash: string;
};

export const Columns: ColumnDef<Dependents>[] = [
  {
    accessorKey: 'specifier',
    header: 'Specifier',
  },
  {
    accessorKey: 'repository',
    header: 'Repository',
    cell: ({ cell }) => (
      <p className="flex items-center gap-3">
        <Image
          src={`https://avatars.githubusercontent.com/${cell.row.original.repository.split('/')[0]}`}
          alt={cell.row.original.repository}
          className="rounded-full"
          width={20}
          height={20}
          priority
          quality={10}
        />
        {cell.row.original.repository}
      </p>
    ),
  },
  {
    accessorKey: 'extension',
    header: () => <p className="text-center">File Extension</p>,
    cell: ({ cell }) => {
      const ext = cell.row.original.filename.split('.').pop();
      return <p className="text-center">{ext}</p>;
    },
  },
  {
    accessorKey: 'source',
    header: () => <p className="text-center">Source</p>,
    cell: ({ cell }) => {
      const link = `https://github.com/${cell.row.original.repository}/blob/${cell.row.original.hash}${cell.row.original.filename}`;
      return (
        <a href={link} target="blank" className="flex justify-center" rel="noreferrer">
          <ExternalLink size={15} />
        </a>
      );
    },
  },
];
