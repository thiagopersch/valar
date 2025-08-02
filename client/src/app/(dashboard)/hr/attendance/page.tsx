'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { endOfWeek, format, parseISO, startOfWeek } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Clock } from 'lucide-react';
import { useEffect, useState } from 'react';
import { BalanceCard } from '../_components/balance-card';
import { LiveClock } from '../_components/live-clock';
import { ManualEntryDialog } from '../_components/manual-entry-dialog';
import { RecentEntries } from '../_components/recent-entries';
import { RecommendationsCard } from '../_components/recommendations-card';
import { StatsCards } from '../_components/stats-cards';

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
  // Legacy fields for backward compatibility
  clockIn?: string;
  clockOut?: string;
}

const WORK_HOURS_PER_DAY = 8;
const WORK_HOURS_PER_WEEK = 40;

export default function TimeTrackingDashboard() {
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [currentEntry, setCurrentEntry] = useState<TimeEntry | null>(null);
  const [isWorking, setIsWorking] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<TimeEntry | null>(null);
  const [manualPeriods, setManualPeriods] = useState<TimePeriod[]>([
    { clockIn: '', clockOut: '' },
  ]);

  // Migration function to convert old format to new format
  const migrateEntry = (entry: any): TimeEntry => {
    // If entry already has periods, return as is
    if (entry.periods && Array.isArray(entry.periods)) {
      return {
        ...entry,
        periods: entry.periods || [],
      };
    }

    // Convert old format to new format
    const periods: TimePeriod[] = [];
    if (entry.clockIn) {
      periods.push({
        clockIn: entry.clockIn,
        clockOut: entry.clockOut || '',
      });
    }

    return {
      id: entry.id,
      date: entry.date,
      periods: periods,
      totalHours: entry.totalHours || 0,
      extraHours: entry.extraHours || 0,
      missingHours: entry.missingHours || 0,
    };
  };

  // Load data from localStorage on mount
  useEffect(() => {
    const savedEntries = localStorage.getItem('timeEntries');
    if (savedEntries) {
      try {
        const parsedEntries = JSON.parse(savedEntries);
        // Migrate old entries to new format
        const migratedEntries = parsedEntries.map(migrateEntry);
        setEntries(migratedEntries);

        // Check if there's an ongoing work session
        const today = format(new Date(), 'yyyy-MM-dd');
        const todayEntry = migratedEntries.find(
          (entry: TimeEntry) => entry.date === today,
        );
        if (todayEntry && todayEntry.periods && todayEntry.periods.length > 0) {
          const hasOpenPeriod = todayEntry.periods.some(
            (period: any) => period.clockIn && !period.clockOut,
          );
          if (hasOpenPeriod) {
            setCurrentEntry(todayEntry);
            setIsWorking(true);
          }
        }
      } catch (error) {
        console.error('Error loading saved entries:', error);
        // Reset to empty array if there's an error
        setEntries([]);
      }
    }
  }, []);

  // Save to localStorage whenever entries change
  useEffect(() => {
    if (entries.length > 0) {
      localStorage.setItem('timeEntries', JSON.stringify(entries));
    }
  }, [entries]);

  const calculatePeriodHours = (clockIn: string, clockOut: string): number => {
    if (!clockIn || !clockOut) return 0;
    const start = new Date(`2000-01-01T${clockIn}`);
    const end = new Date(`2000-01-01T${clockOut}`);
    const diffMs = end.getTime() - start.getTime();
    return Math.max(0, diffMs / (1000 * 60 * 60)); // Convert to hours, ensure non-negative
  };

  const calculateTotalHours = (periods: TimePeriod[]): number => {
    if (!periods || !Array.isArray(periods)) return 0;
    return periods.reduce((total, period) => {
      if (period && period.clockIn && period.clockOut) {
        return total + calculatePeriodHours(period.clockIn, period.clockOut);
      }
      return total;
    }, 0);
  };

  const handleClockIn = () => {
    const now = new Date();
    const today = format(now, 'yyyy-MM-dd');
    const time = format(now, 'HH:mm');

    const existingEntry = entries.find((entry) => entry.date === today);

    if (existingEntry) {
      // Add new period to existing entry
      const currentPeriods = existingEntry.periods || [];
      const newPeriods = [...currentPeriods, { clockIn: time, clockOut: '' }];
      const updatedEntry: TimeEntry = {
        ...existingEntry,
        periods: newPeriods,
      };

      setEntries((prev) =>
        prev.map((entry) =>
          entry.id === existingEntry.id ? updatedEntry : entry,
        ),
      );
      setCurrentEntry(updatedEntry);
    } else {
      // Create new entry
      const newEntry: TimeEntry = {
        id: `${today}-${Date.now()}`,
        date: today,
        periods: [{ clockIn: time, clockOut: '' }],
        totalHours: 0,
        extraHours: 0,
        missingHours: WORK_HOURS_PER_DAY,
      };

      setEntries((prev) => [...prev, newEntry]);
      setCurrentEntry(newEntry);
    }

    setIsWorking(true);
  };

  const handleClockOut = () => {
    if (!currentEntry || !currentEntry.periods) return;

    const now = new Date();
    const time = format(now, 'HH:mm');

    // Find the last period without clockOut
    const updatedPeriods = currentEntry.periods.map((period, index) => {
      if (
        index === currentEntry.periods.length - 1 &&
        period.clockIn &&
        !period.clockOut
      ) {
        return { ...period, clockOut: time };
      }
      return period;
    });

    const totalHours = calculateTotalHours(updatedPeriods);
    const extraHours = Math.max(0, totalHours - WORK_HOURS_PER_DAY);
    const missingHours = Math.max(0, WORK_HOURS_PER_DAY - totalHours);

    const updatedEntry: TimeEntry = {
      ...currentEntry,
      periods: updatedPeriods,
      totalHours,
      extraHours,
      missingHours,
    };

    setEntries((prev) =>
      prev.map((entry) =>
        entry.id === currentEntry.id ? updatedEntry : entry,
      ),
    );
    setCurrentEntry(null);
    setIsWorking(false);
  };

  const handleManualEntry = () => {
    const validPeriods = manualPeriods.filter(
      (period) => period && period.clockIn && period.clockOut,
    );
    if (validPeriods.length === 0) return;

    const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');
    const totalHours = calculateTotalHours(validPeriods);
    const extraHours = Math.max(0, totalHours - WORK_HOURS_PER_DAY);
    const missingHours = Math.max(0, WORK_HOURS_PER_DAY - totalHours);

    const newEntry: TimeEntry = {
      id: editingEntry?.id || `${selectedDateStr}-${Date.now()}`,
      date: selectedDateStr,
      periods: validPeriods,
      totalHours,
      extraHours,
      missingHours,
    };

    if (editingEntry) {
      // Update existing entry
      setEntries((prev) =>
        prev.map((entry) => (entry.id === editingEntry.id ? newEntry : entry)),
      );
    } else {
      // Add new entry or replace existing entry for the same date
      setEntries((prev) => {
        const filtered = prev.filter((entry) => entry.date !== selectedDateStr);
        return [...filtered, newEntry];
      });
    }

    // Reset form
    setManualPeriods([{ clockIn: '', clockOut: '' }]);
    setEditingEntry(null);
    setIsDialogOpen(false);
  };

  const handleEditEntry = (entry: TimeEntry) => {
    setEditingEntry(entry);
    setSelectedDate(parseISO(entry.date));
    const periodsToEdit =
      entry.periods && entry.periods.length > 0
        ? [...entry.periods]
        : [{ clockIn: '', clockOut: '' }];
    setManualPeriods(periodsToEdit);
    setIsDialogOpen(true);
  };

  const handleDeleteEntry = (entryId: string) => {
    setEntries((prev) => prev.filter((entry) => entry.id !== entryId));
  };

  const getSelectedDateEntry = () => {
    const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');
    return entries.find((entry) => entry.date === selectedDateStr);
  };

  const formatPeriods = (periods: TimePeriod[]): string => {
    if (!periods || !Array.isArray(periods)) return '';
    return periods
      .filter((period) => period && period.clockIn)
      .map(
        (period) =>
          `${period.clockIn}${period.clockOut ? ` - ${period.clockOut}` : ''}`,
      )
      .join(' | ');
  };

  // Calculate weekly totals
  const weekStart = startOfWeek(new Date(), { locale: ptBR });
  const weekEnd = endOfWeek(new Date(), { locale: ptBR });

  const weeklyEntries = entries.filter((entry) => {
    const entryDate = parseISO(entry.date);
    return entryDate >= weekStart && entryDate <= weekEnd;
  });

  const weeklyTotals = weeklyEntries.reduce(
    (acc, entry) => ({
      totalHours: acc.totalHours + (entry.totalHours || 0),
      extraHours: acc.extraHours + (entry.extraHours || 0),
      missingHours: acc.missingHours + (entry.missingHours || 0),
    }),
    { totalHours: 0, extraHours: 0, missingHours: 0 },
  );

  // Calculate overall balance
  const overallTotals = entries.reduce(
    (acc, entry) => ({
      totalHours: acc.totalHours + (entry.totalHours || 0),
      extraHours: acc.extraHours + (entry.extraHours || 0),
      missingHours: acc.missingHours + (entry.missingHours || 0),
    }),
    { totalHours: 0, extraHours: 0, missingHours: 0 },
  );

  const balance = overallTotals.extraHours - overallTotals.missingHours;
  const hoursToCompensate = balance < 0 ? Math.abs(balance) : 0;
  const extraHoursAvailable = balance > 0 ? balance : 0;

  const todayEntry = entries.find(
    (entry) => entry.date === format(new Date(), 'yyyy-MM-dd'),
  );

  return (
    <div className="dark:bg-background p-4 transition-colors">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Controle de Ponto
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {format(new Date(), "EEEE, dd 'de' MMMM 'de' yyyy", {
              locale: ptBR,
            })}
          </p>
        </div>

        {/* Clock In/Out Section */}
        <Card className="bg-white dark:bg-gray-800 shadow-lg border-gray-200 dark:border-gray-700">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-gray-900 dark:text-white">
              <Clock className="w-6 h-6" />
              Registro de Ponto
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              {isWorking
                ? 'Você está trabalhando - último registro de entrada'
                : 'Clique para iniciar seu expediente'}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <LiveClock />

            <div className="flex gap-2 justify-center">
              {isWorking ? (
                <Button
                  onClick={handleClockOut}
                  size="lg"
                  variant="destructive"
                  className="px-8 py-3"
                >
                  Registrar Saída
                </Button>
              ) : (
                <Button onClick={handleClockIn} size="lg" className="px-8 py-3">
                  Registrar Entrada
                </Button>
              )}

              <ManualEntryDialog
                isOpen={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
                manualPeriods={manualPeriods}
                onPeriodsChange={setManualPeriods}
                editingEntry={editingEntry}
                onSave={handleManualEntry}
                onCancel={() => {
                  setIsDialogOpen(false);
                  setEditingEntry(null);
                  setManualPeriods([{ clockIn: '', clockOut: '' }]);
                }}
                calculateTotalHours={calculateTotalHours}
                getSelectedDateEntry={getSelectedDateEntry}
                WORK_HOURS_PER_DAY={WORK_HOURS_PER_DAY}
              />
            </div>

            {todayEntry && (
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <div className="font-semibold mb-1">Períodos de hoje:</div>
                <div>
                  {formatPeriods(todayEntry.periods) ||
                    'Nenhum período registrado'}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <StatsCards
          todayHours={todayEntry ? todayEntry.totalHours || 0 : 0}
          weeklyHours={weeklyTotals.totalHours}
          extraHours={overallTotals.extraHours}
          missingHours={overallTotals.missingHours}
          WORK_HOURS_PER_DAY={WORK_HOURS_PER_DAY}
          WORK_HOURS_PER_WEEK={WORK_HOURS_PER_WEEK}
        />

        {/* Balance and Recommendations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BalanceCard
            balance={balance}
            extraHours={overallTotals.extraHours}
            missingHours={overallTotals.missingHours}
          />
          <RecommendationsCard
            balance={balance}
            hoursToCompensate={hoursToCompensate}
            extraHoursAvailable={extraHoursAvailable}
          />
        </div>

        {/* Recent Entries */}
        <RecentEntries
          entries={entries}
          onEditEntry={handleEditEntry}
          onDeleteEntry={handleDeleteEntry}
          formatPeriods={formatPeriods}
        />
      </div>
    </div>
  );
}
