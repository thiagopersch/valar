import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CardStatisticsProps {
  title: string;
  value: number;
  percentage: number;
}

export default function CardStatistics({ title, value, percentage }: CardStatisticsProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900 dark:text-white">{value}</div>
        <p className="mt-1 text-xs text-green-600">{percentage}% vs mês anterior</p>
      </CardContent>
    </Card>
  );
}
