import { DataTable } from '@/components/shadcn/data-table';
import { getSpecifiers } from '@/libs/model/getSpecifiers';
import { SpecifiersColumns } from './_internal/SpecifiersColumns';
import Image from 'next/image';
import Link from 'next/link';
import { Section } from '@/components/Section';
import { OverviewCard } from './_internal/OverviewCard';

export default function Home() {
  const specifiers = getSpecifiers();

  const uniqueRepositories = new Set(specifiers.map((specifier) => specifier.repository));
  const countByRepositories = new Map<string, number>();
  const countBySpecifiers = new Map<string, number>();

  for (const specifier of specifiers) {
    const countByRepository = countByRepositories.get(specifier.repository) ?? 0;
    const countBySpecifier = countBySpecifiers.get(specifier.specifier) ?? 0;

    countByRepositories.set(specifier.repository, countByRepository + 1);
    countBySpecifiers.set(specifier.specifier, countBySpecifier + 1);
  }

  const sortedRepositories = Array.from(countByRepositories.entries()).sort((a, b) => b[1] - a[1]);
  const sortedSpecifiers = Array.from(countBySpecifiers.entries()).sort((a, b) => b[1] - a[1]);

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
          <div className="grid w-fit grid-flow-col gap-3 text-nowrap">
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
      </Section>
      <Section title="All Specifiers">
        <DataTable columns={SpecifiersColumns} data={specifiers} />
      </Section>
    </main>
  );
}
