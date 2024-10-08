'use client';

import Image from 'next/image';
import { FileIcon } from '@/components/FileIcon';
import { OutBoundLink } from '@/components/OutBoundLink';
import { Specifier } from '@/libs/model/getSpecifiers';
import type { ColumnDef } from '@tanstack/react-table';

export const SpecifiersColumns: ColumnDef<Specifier>[] = [
  {
    accessorKey: 'specifier',
    header: 'Specifier',
  },
  {
    accessorKey: 'repository',
    header: 'Repository',
    cell: ({ cell }) => {
      const repository = cell.row.original.repository.split('/')[0];
      return (
        <OutBoundLink
          href={`https://github.com/${cell.row.original.repository}`}
          rel="noreferrer"
          className="flex items-center gap-1 hover:underline"
        >
          <Image
            src={`https://avatars.githubusercontent.com/${repository}`}
            alt={repository}
            className="rounded-full"
            width={20}
            height={20}
            priority
            quality={10}
          />
          {cell.row.original.repository}
        </OutBoundLink>
      );
    },
  },
  {
    accessorKey: 'source',
    header: 'Source',
    cell: ({ cell }) => {
      const link = `https://github.com/${cell.row.original.repository}/blob/${cell.row.original.hash}${cell.row.original.filename}`;
      return (
        <OutBoundLink href={link} className="flex items-center gap-1 hover:underline">
          <FileIcon filename={cell.row.original.filename} />
          {cell.row.original.filename}
        </OutBoundLink>
      );
    },
  },
];
