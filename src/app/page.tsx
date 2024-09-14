import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/shadcn/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/shadcn/chart';
import { DataTable } from '@/components/shadcn/data-table';
import { getDependents } from '@/libs/model/getDependents';
import { BarChart, Bar, CartesianGrid, XAxis, PieChart, Pie, LabelList } from 'recharts';
import { Columns } from './_internal/Columns';

export default function Home() {
  // const chartData: { name: string; value: number }[] = Object.entries(dependentsData)
  //   .map(([key, value]) => ({
  //     name: key,
  //     value: value.length,
  //   }))
  //   .filter(({ value }) => value > 0)
  //   .sort((a, b) => b.value - a.value);
  // const top5Dependents = chartData
  //   .slice(0, 5)
  //   .map(({ name, value }) => ({ name, value, fill: `var(--color-${name.split('/')[1]})` }));

  // const charConfig: ChartConfig = {
  //   name: { label: 'Dependents', color: 'hsl(var(--chart-1))' },
  // };
  // const pieCharConfig: ChartConfig = top5Dependents.reduce(
  //   (acc, { name }, index) => ({
  //     ...acc,
  //     [name.split('/')[1]]: { label: name, color: `hsl(var(--chart-${index + 1}))` },
  //   }),
  //   {}
  // );
  const data = getDependents();

  return (
    <div>
      <DataTable columns={Columns} data={data} />
      {/* <Card>
        <CardHeader>
          <CardTitle>Total count of imports</CardTitle>
          <CardDescription>
            There are {chartData.reduce((acc, { value }) => acc + value, 0)} imports in the repository.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={charConfig}>
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="name"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.split('/')[1]}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="value" fill="var(--color-name)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Top 5 dependents</CardTitle>
          <CardDescription>These are the top 5 dependents of the repository.</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={pieCharConfig}>
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              <Pie data={top5Dependents} dataKey="value" nameKey="name" strokeWidth={5}>
                <LabelList dataKey="name" stroke="none" fontSize={12} position="outside" />
                <LabelList dataKey="value" stroke="none" fontSize={14} position="inside" className="fill-background" />
              </Pie>
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card> */}
    </div>
  );
}
