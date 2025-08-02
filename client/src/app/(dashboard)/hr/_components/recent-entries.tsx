import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { TimeEntryCard } from './time-entry-card';

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

interface RecentEntriesProps {
  entries: TimeEntry[];
  onEditEntry: (entry: TimeEntry) => void;
  onDeleteEntry: (entryId: string) => void;
  formatPeriods: (periods: TimePeriod[]) => string;
}

export function RecentEntries({
  entries,
  onEditEntry,
  onDeleteEntry,
  formatPeriods,
}: RecentEntriesProps) {
  return (
    <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="text-gray-900 dark:text-white">
          Registros Recentes
        </CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-400">
          Últimos 7 dias de trabalho
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {entries
            .slice(-7)
            .reverse()
            .map((entry) => (
              <TimeEntryCard
                key={entry.id}
                entry={entry}
                onEdit={onEditEntry}
                onDelete={onDeleteEntry}
                formatPeriods={formatPeriods}
              />
            ))}

          {entries.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              Nenhum registro encontrado. Faça seu primeiro registro de ponto!
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
