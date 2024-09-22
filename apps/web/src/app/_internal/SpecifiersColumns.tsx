'use client';

import { FileIcon } from '@/components/FileIcon';
import { Specifier } from '@/libs/model/getSpecifiers';
import type { ColumnDef } from '@tanstack/react-table';
import Image from 'next/image';

export const SpecifiersColumns: ColumnDef<Specifier>[] = [
  {
    accessorKey: 'specifier',
    header: 'Specifier',
  },
  {
    accessorKey: 'repository',
    header: 'Repository',
    cell: ({ cell }) => (
      <a
        href={`https://github.com/${cell.row.original.repository}`}
        target="_blank"
        rel="noreferrer"
        className="flex items-center gap-1 hover:underline"
      >
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
      </a>
    ),
  },
  {
    accessorKey: 'source',
    header: 'Source',
    cell: ({ cell }) => {
      const link = `https://github.com/${cell.row.original.repository}/blob/${cell.row.original.hash}${cell.row.original.filename}`;
      return (
        <a href={link} target="blank" className="flex items-center gap-1 hover:underline">
          <FileIcon filename={cell.row.original.filename} />
          {cell.row.original.filename}
        </a>
      );
    },
  },
];