import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface BalanceCardProps {
  balance: number;
  extraHours: number;
  missingHours: number;
}

export function BalanceCard({
  balance,
  extraHours,
  missingHours,
}: BalanceCardProps) {
  return (
    <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
          {balance >= 0 ? (
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
          )}
          Saldo de Horas
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div
            className={`text-4xl font-bold ${
              balance >= 0
                ? 'text-green-600 dark:text-green-400'
                : 'text-red-600 dark:text-red-400'
            }`}
          >
            {balance >= 0 ? '+' : ''}
            {balance.toFixed(1)}h
          </div>
          <Badge
            variant={balance >= 0 ? 'default' : 'destructive'}
            className={`mt-2 ${
              balance >= 0
                ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border-green-200 dark:border-green-800'
                : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 border-red-200 dark:border-red-800'
            }`}
          >
            {balance >= 0 ? 'Saldo Positivo' : 'Saldo Negativo'}
          </Badge>
        </div>

        <Separator className="bg-gray-200 dark:bg-gray-700" />

        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-gray-700 dark:text-gray-300">
            <span>Total de horas extras:</span>
            <span className="font-semibold text-green-600 dark:text-green-400">
              +{extraHours.toFixed(1)}h
            </span>
          </div>
          <div className="flex justify-between text-gray-700 dark:text-gray-300">
            <span>Total de horas faltantes:</span>
            <span className="font-semibold text-red-600 dark:text-red-400">
              -{missingHours.toFixed(1)}h
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
