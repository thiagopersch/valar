import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Minus } from 'lucide-react';

interface TimePeriod {
  clockIn: string;
  clockOut: string;
}

interface PeriodInputProps {
  period: TimePeriod;
  index: number;
  canRemove: boolean;
  onUpdate: (
    index: number,
    field: 'clockIn' | 'clockOut',
    value: string,
  ) => void;
  onRemove: (index: number) => void;
}

export function PeriodInput({
  period,
  index,
  canRemove,
  onUpdate,
  onRemove,
}: PeriodInputProps) {
  return (
    <div className="flex items-center gap-2 p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
      <div className="flex-1 grid grid-cols-2 gap-2">
        <div>
          <Label
            htmlFor={`clockIn-${index}`}
            className="text-xs text-gray-700 dark:text-gray-300"
          >
            {index + 1}ª Entrada
          </Label>
          <Input
            id={`clockIn-${index}`}
            type="time"
            value={period?.clockIn || ''}
            onChange={(e) => onUpdate(index, 'clockIn', e.target.value)}
            className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <Label
            htmlFor={`clockOut-${index}`}
            className="text-xs text-gray-700 dark:text-gray-300"
          >
            {index + 1}ª Saída
          </Label>
          <Input
            id={`clockOut-${index}`}
            type="time"
            value={period?.clockOut || ''}
            onChange={(e) => onUpdate(index, 'clockOut', e.target.value)}
            className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
          />
        </div>
      </div>
      {canRemove && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onRemove(index)}
          className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
        >
          <Minus className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
}
