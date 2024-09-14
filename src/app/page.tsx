import { DataTable } from '@/components/shadcn/data-table';
import { getDependents } from '@/libs/model/getDependents';
import { Columns } from './_internal/Columns';

export default function Home() {
  const data = getDependents();

  return (
    <div>
      <DataTable columns={Columns} data={data} />
    </div>
  );
}
