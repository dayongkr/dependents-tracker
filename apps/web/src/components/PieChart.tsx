'use client';

import * as React from 'react';
import { Label, Pie, PieChart as PieChartRecharts } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/shadcn/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/shadcn/chart';
import { cn } from '@/libs/utils';

export function PieChart<T>({
  data,
  title,
  description,
  nameKey,
  dataKey,
  donut,
}: Readonly<{
  data: T[];
  title: string;
  description: string;
  nameKey: keyof T & string;
  dataKey: keyof T & string;
  donut?: { title: string; description: string };
}>) {
  const chartConfig: ChartConfig = {};
  const coloredData = data.slice();

  for (let index = 0; index < coloredData.length; index++) {
    const item = coloredData[index];

    chartConfig[item[nameKey] as string] = {
      label: item[nameKey] as string,
      color: `hsl(var(--chart-${index + 1}))`,
    };

    coloredData[index] = {
      ...item,
      fill: `var(--color-${item[nameKey]})`,
    };
  }

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
          <PieChartRecharts>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={coloredData}
              dataKey={dataKey}
              nameKey={nameKey}
              innerRadius={donut ? 60 : 0}
              strokeWidth={5}
              label={!donut}
            >
              {donut && (
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                      return (
                        <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                          <tspan x={viewBox.cx} y={viewBox.cy} className={cn('fill-foreground text-3xl font-bold')}>
                            {donut.title}
                          </tspan>
                          <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-muted-foreground">
                            {donut.description}
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              )}
            </Pie>
          </PieChartRecharts>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
