import Image from 'next/image';
import { BarChart } from '@/components/BarChart';
import { OutBoundLink } from '@/components/OutBoundLink';
import { PieChart } from '@/components/PieChart';
import { Section } from '@/components/Section';
import { DataTable } from '@/components/shadcn/data-table';
import { getSpecifiers } from '@/libs/model/getSpecifiers';
import { countBy, getTopN, sortBy } from '@/libs/utils';
import { OverviewCard } from './_internal/OverviewCard';
import { SpecifiersColumns } from './_internal/SpecifiersColumns';

export default function Home() {
  const specifiers = sortBy(getSpecifiers(), (a, b) => a.specifier.localeCompare(b.specifier));

  const countByRepositories = countBy(specifiers, (specifier) => specifier.repository);
  const countBySpecifiers = countBy(specifiers, (specifier) => specifier.specifier);
  const countByExtensions = countBy(specifiers, (specifier) => specifier.filename.toLowerCase().split('.').pop() ?? '');
  const countByUsers = countBy(specifiers, (specifier) => specifier.repository.split('/')[0]);

  const sortedRepositories = sortBy(Array.from(countByRepositories.entries()), (a, b) => b[1] - a[1]);
  const sortedSpecifiers = sortBy(Array.from(countBySpecifiers.entries()), (a, b) => b[1] - a[1]);
  const sortedExtensions = sortBy(Array.from(countByExtensions.entries()), (a, b) => b[1] - a[1]);
  const sortedUsers = sortBy(Array.from(countByUsers.entries()), (a, b) => b[1] - a[1]);

  return (
    <main className="container max-w-7xl overflow-y-auto p-6">
      <OutBoundLink href="https://github.com/toss/es-toolkit" className="flex items-center gap-1">
        <Image
          src="https://avatars.githubusercontent.com/toss"
          alt="toss"
          className="rounded-full"
          width={35}
          height={35}
        />
        <h1 className="text-2xl font-semibold">toss/es-toolkit</h1>
      </OutBoundLink>
      <Section title="Overview" className="gap-3">
        <div className="overflow-x-auto">
          <div className="flex gap-3 text-nowrap">
            <OverviewCard
              title="Total Import specifiers"
              primary={specifiers.length}
              description="Only ESM format imports."
            />
            <OverviewCard
              title="Total Repositories"
              primary={sortedRepositories.length}
              description="Only used repositories were counted, not just installed."
            />
            <OverviewCard
              title="Most Imported Repository"
              primary={
                <OutBoundLink href={`https://github.com/${sortedRepositories[0][0]}`} className="hover:underline">
                  {sortedRepositories[0][0]}
                </OutBoundLink>
              }
              description={`Imported ${sortedRepositories[0][1]} times.`}
            />
            <OverviewCard
              title="Most Imported Specifier"
              primary={sortedSpecifiers[0][0]}
              description={`Imported ${sortedSpecifiers[0][1]} times.`}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-4">
          <BarChart
            data={getTopN(sortedRepositories, 10)}
            title="Top 10 Specifiers"
            description="Only ESM format imports."
            xDataKey="0"
            yDataKey="1"
            label="imports"
          />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1 lg:grid-rows-2">
            <PieChart
              data={getTopN(sortedExtensions, 5)}
              title="Top 5 Extensions"
              description="that imported the most frequently."
              nameKey="0"
              dataKey="1"
              donut={{ title: sortedExtensions[0][0], description: 'Top 1 Extension' }}
            />
            <PieChart
              data={getTopN(sortedUsers, 5)}
              title="Top 5 Users"
              description="who imported the most frequently."
              nameKey="0"
              dataKey="1"
            />
          </div>
        </div>
      </Section>
      <Section title="Specifiers table">
        <DataTable columns={SpecifiersColumns} data={specifiers} filter="specifier" />
      </Section>
    </main>
  );
}
