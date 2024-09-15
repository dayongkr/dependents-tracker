import { DataTable } from '@/components/shadcn/data-table';
import { getDependents } from '@/libs/model/getDependents';
import { Columns } from './_internal/Columns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/shadcn/card';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  const data = getDependents();

  return (
    <div className="flex flex-col gap-6">
      <Link href="https://github.com/toss/es-toolkit" target="_blank" className="flex items-center gap-2">
        <Image
          src="https://avatars.githubusercontent.com/toss"
          alt="toss"
          className="rounded-full"
          width={40}
          height={40}
        />
        <h1 className="text-2xl font-semibold">toss/es-toolkit</h1>
      </Link>
      <h2 className="text-xl font-semibold">Overview</h2>
      <div className="overflow-x-auto">
        <div className="grid w-fit grid-flow-col gap-3 overflow-x-auto text-nowrap">
          <Card>
            <CardHeader className="pb-2">Total Import specifiers</CardHeader>
            <CardContent>
              <CardTitle className="mb-2 text-primary">{data.length.toLocaleString()}</CardTitle>
              <CardDescription>Collected only imported in ESM format.</CardDescription>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">Total Repositories</CardHeader>
            <CardContent>
              <CardTitle className="mb-2 text-primary">
                {new Set(data.map((d) => d.repository)).size.toLocaleString()}
              </CardTitle>
              <CardDescription>Counted actually called and using it.</CardDescription>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">Top 1 User</CardHeader>
            <CardContent>
              <CardTitle className="mb-2 text-primary">Unknown</CardTitle>
              <CardDescription>Not yet implemented.</CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
      <h2 className="text-xl font-semibold">All dependents</h2>
      <DataTable columns={Columns} data={data} />
    </div>
  );
}
