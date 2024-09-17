'use client';

import { Bar, BarChart as BarChartRecharts, CartesianGrid, LabelList, XAxis } from 'recharts';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/shadcn/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/shadcn/chart';

export function BarChart<T>({
  data,
  title,
  description,
  xDataKey,
  yDataKey,
  label,
}: Readonly<{
  data: T[];
  title: string;
  description: string;
  xDataKey: string & keyof T;
  yDataKey: string & keyof T;
  label?: string;
}>) {
  const chartConfig = {
    [yDataKey]: {
      label: label,
      color: 'hsl(var(--chart-1))',
    },
  } satisfies ChartConfig;

  return (
    <Card className="flex flex-col lg:col-span-3">
      <CardHeader>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex w-full flex-1 flex-col justify-center">
        <ChartContainer config={chartConfig}>
          <BarChartRecharts
            accessibilityLayer
            data={data}
            margin={{
              top: 20,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis dataKey={xDataKey} tickLine={false} tickMargin={10} axisLine={false} />
            {label && <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />}
            <Bar dataKey={yDataKey} fill={`var(--color-${yDataKey})`} radius={8}>
              <LabelList position="top" offset={12} className="fill-foreground" fontSize={12} />
            </Bar>
          </BarChartRecharts>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
