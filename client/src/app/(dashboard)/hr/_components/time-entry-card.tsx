import { Button } from '@/components/ui/button';
import { format, isToday, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Edit, Trash2 } from 'lucide-react';

interface TimePeriod {
  clockIn: string;
  clockOut: string;
}

interface TimeEntry {
  id: string;
  date: string;
  periods: TimePeriod[];
  totalHours: number;
  extraHours: number;
  missingHours: number;
}

interface TimeEntryCardProps {
  entry: TimeEntry;
  onEdit: (entry: TimeEntry) => void;
  onDelete: (entryId: string) => void;
  formatPeriods: (periods: TimePeriod[]) => string;
}

export function TimeEntryCard({
  entry,
  onEdit,
  onDelete,
  formatPeriods,
}: TimeEntryCardProps) {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-3">
        <div
          className={`w-3 h-3 rounded-full ${
            isToday(parseISO(entry.date))
              ? 'bg-blue-500 dark:bg-blue-400'
              : 'bg-gray-300 dark:bg-gray-600'
          }`}
        />
        <div>
          <div className="font-medium text-gray-900 dark:text-white">
            {format(parseISO(entry.date), 'dd/MM/yyyy - EEEE', {
              locale: ptBR,
            })}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {formatPeriods(entry.periods) || 'Nenhum período'}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <div className="font-semibold text-gray-900 dark:text-white">
            {(entry.totalHours || 0).toFixed(1)}h
          </div>
          <div className="text-sm">
            {(entry.extraHours || 0) > 0 && (
              <span className="text-green-600 dark:text-green-400">
                +{(entry.extraHours || 0).toFixed(1)}h
              </span>
            )}
            {(entry.missingHours || 0) > 0 && (
              <span className="text-red-600 dark:text-red-400">
                -{(entry.missingHours || 0).toFixed(1)}h
              </span>
            )}
            {(entry.extraHours || 0) === 0 &&
              (entry.missingHours || 0) === 0 && (
                <span className="text-gray-500 dark:text-gray-400">Normal</span>
              )}
          </div>
        </div>
        <div className="flex gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onEdit(entry)}
            className="h-8 w-8 p-0 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Edit className="w-3 h-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDelete(entry.id)}
            className="h-8 w-8 p-0 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}
