import { DataTable } from '@/components/shadcn/data-table';
import { getSpecifiers } from '@/libs/model/getSpecifiers';
import { SpecifiersColumns } from './_internal/SpecifiersColumns';
import Image from 'next/image';
import Link from 'next/link';
import { Section } from '@/components/Section';
import { OverviewCard } from './_internal/OverviewCard';
import { BarChart } from '@/components/BarChart';
import { PieChart } from '@/components/PieChart';

export default function Home() {
  const specifiers = getSpecifiers();

  const countByRepositories = new Map<string, number>();
  const countBySpecifiers = new Map<string, number>();
  const countByExtensions = new Map<string, number>();
  const countByUsers = new Map<string, number>();

  for (const specifier of specifiers) {
    const extension = specifier.filename.toLowerCase().split('.').pop() ?? '';
    const user = specifier.repository.split('/')[0];

    const countByRepository = countByRepositories.get(specifier.repository) ?? 0;
    const countBySpecifier = countBySpecifiers.get(specifier.specifier) ?? 0;
    const countByExtension = countByExtensions.get(extension) ?? 0;
    const countByUser = countByUsers.get(user) ?? 0;

    countByRepositories.set(specifier.repository, countByRepository + 1);
    countBySpecifiers.set(specifier.specifier, countBySpecifier + 1);
    countByExtensions.set(extension, countByExtension + 1);
    countByUsers.set(user, countByUser + 1);
  }

  const sortedRepositories = Array.from(countByRepositories.entries()).sort((a, b) => b[1] - a[1]);
  const sortedSpecifiers = Array.from(countBySpecifiers.entries()).sort((a, b) => b[1] - a[1]);
  const sortedExtensions = Array.from(countByExtensions.entries()).sort((a, b) => b[1] - a[1]);
  const sortedUsers = Array.from(countByUsers.entries()).sort((a, b) => b[1] - a[1]);

  const uniqueRepositories = new Set(specifiers.map((specifier) => specifier.repository));

  return (
    <main className="container max-w-7xl overflow-y-auto p-6">
      <Link href="https://github.com/toss/es-toolkit" target="_blank" className="flex items-center gap-1">
        <Image
          src="https://avatars.githubusercontent.com/toss"
          alt="toss"
          className="rounded-full"
          width={35}
          height={35}
        />
        <h1 className="text-2xl font-semibold">toss/es-toolkit</h1>
      </Link>
      <Section title="Overview">
        <div className="overflow-x-auto">
          <div className="flex gap-3 text-nowrap">
            <OverviewCard
              title="Total Import specifiers"
              primary={specifiers.length}
              description="Collected only imported in ESM format."
            />
            <OverviewCard
              title="Total Repositories"
              primary={uniqueRepositories.size}
              description="Not just installed, but also imported."
            />
            <OverviewCard
              title="Most Imported Repository"
              primary={
                <Link href={`https://github.com/${sortedRepositories[0][0]}`} className="hover:underline">
                  {sortedRepositories[0][0]}
                </Link>
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
            data={sortedSpecifiers.slice(0, 10)}
            title="Top 10 Specifiers"
            description="Counted only imported in ESM format."
            xDataKey="0"
            yDataKey="1"
          />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1 lg:grid-rows-2">
            <PieChart
              data={sortedExtensions.slice(0, 5)}
              title="Top 5 Extensions"
              description="Counted only imported in ESM format."
              nameKey="0"
              dataKey="1"
              donut={{ title: sortedExtensions[0][0], description: 'Top 1 Extension' }}
            />
            <PieChart
              data={sortedUsers.slice(0, 5)}
              title="Top 5 Users"
              description="Counted only imported in ESM format."
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
