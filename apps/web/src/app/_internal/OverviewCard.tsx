import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/shadcn/card';

export function OverviewCard({
  title,
  primary,
  description,
}: Readonly<{ title: string; primary: string | number | React.ReactElement; description: string }>) {
  const formattedTitle = typeof primary === 'number' ? primary.toLocaleString() : primary;

  return (
    <Card className="w-full min-w-fit">
      <CardHeader className="pb-2">{title}</CardHeader>
      <CardContent>
        <CardTitle className="text-primary mb-2">{formattedTitle}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardContent>
    </Card>
  );
}
