'use client';

import * as React from 'react';
import { Label, Pie, PieChart } from 'recharts';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/shadcn/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/shadcn/chart';

export function DonutChart<T>({
  data,
  title,
  description,
  subTitle,
  subDescription,
  nameKey,
  dataKey,
}: Readonly<{
  data: T[];
  title: string;
  description: string;
  subTitle: string;
  subDescription: string;
  nameKey: string & keyof T;
  dataKey: string & keyof T;
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
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie data={coloredData} dataKey={dataKey} nameKey={nameKey} innerRadius={60} strokeWidth={5}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                        <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-3xl font-bold">
                          {subTitle}
                        </tspan>
                        <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-muted-foreground">
                          {subDescription}
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
