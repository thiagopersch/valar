import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarIcon } from 'lucide-react';

interface RecommendationsCardProps {
  balance: number;
  hoursToCompensate: number;
  extraHoursAvailable: number;
}

export function RecommendationsCard({
  balance,
  hoursToCompensate,
  extraHoursAvailable,
}: RecommendationsCardProps) {
  return (
    <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
          <CalendarIcon className="w-5 h-5" />
          Recomendações
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {balance < 0 ? (
          <div className="space-y-3">
            <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
              <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">
                Para Compensar o Déficit:
              </h4>
              <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                <li>• Trabalhe {hoursToCompensate.toFixed(1)}h extras</li>
                <li>
                  • Ou {(hoursToCompensate / 5).toFixed(1)}h por dia nos
                  próximos 5 dias
                </li>
                <li>
                  • Ou {(hoursToCompensate / 2).toFixed(1)}h por dia no fim de
                  semana
                </li>
              </ul>
            </div>
          </div>
        ) : balance > 0 ? (
          <div className="space-y-3">
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                Você tem crédito de horas!
              </h4>
              <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                <li>
                  • {extraHoursAvailable.toFixed(1)}h disponíveis para usar
                </li>
                <li>
                  • Pode sair {(extraHoursAvailable / 5).toFixed(1)}h mais cedo
                  por 5 dias
                </li>
                <li>
                  • Ou tirar {Math.floor(extraHoursAvailable / 8)} dia(s) de
                  folga
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
              Parabéns!
            </h4>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Suas horas estão em perfeito equilíbrio. Continue assim!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
