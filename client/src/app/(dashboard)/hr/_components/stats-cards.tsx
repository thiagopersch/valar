import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingDown, TrendingUp } from 'lucide-react';

interface StatsCardsProps {
  todayHours: number;
  weeklyHours: number;
  extraHours: number;
  missingHours: number;
  WORK_HOURS_PER_DAY: number;
  WORK_HOURS_PER_WEEK: number;
}

export function StatsCards({
  todayHours,
  weeklyHours,
  extraHours,
  missingHours,
  WORK_HOURS_PER_DAY,
  WORK_HOURS_PER_WEEK,
}: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Today's Hours */}
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Horas Hoje
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {todayHours.toFixed(1)}h
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Meta: {WORK_HOURS_PER_DAY}h
          </div>
        </CardContent>
      </Card>

      {/* Weekly Hours */}
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Horas da Semana
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {weeklyHours.toFixed(1)}h
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Meta: {WORK_HOURS_PER_WEEK}h
          </div>
        </CardContent>
      </Card>

      {/* Extra Hours */}
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            Horas Extras
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            +{extraHours.toFixed(1)}h
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Acumuladas
          </div>
        </CardContent>
      </Card>

      {/* Missing Hours */}
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-1">
            <TrendingDown className="w-4 h-4" />
            Horas Faltantes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">
            -{missingHours.toFixed(1)}h
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Acumuladas
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
