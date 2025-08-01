'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { endOfWeek, format, isToday, parseISO, startOfWeek } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  AlertCircle,
  CalendarIcon,
  CheckCircle,
  Clock,
  Edit,
  Minus,
  Plus,
  Trash2,
  TrendingDown,
  TrendingUp,
  TriangleAlert,
} from 'lucide-react';
import { useEffect, useState } from 'react';

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

  const addPeriod = () => {
    setManualPeriods((prev) => [...prev, { clockIn: '', clockOut: '' }]);
  };

  const removePeriod = (index: number) => {
    if (manualPeriods.length > 1) {
      setManualPeriods((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const updatePeriod = (
    index: number,
    field: 'clockIn' | 'clockOut',
    value: string,
  ) => {
    setManualPeriods((prev) =>
      prev.map((period, i) =>
        i === index ? { ...period, [field]: value } : period,
      ),
    );
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
    <div className="dark:bg-background">
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
        <Card className="bg-white dark:bg-muted shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Clock className="w-6 h-6" />
              Registro de Ponto
            </CardTitle>
            <CardDescription>
              {isWorking
                ? 'Você está trabalhando - último registro de entrada'
                : 'Clique para iniciar seu expediente'}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="text-4xl font-mono font-bold text-gray-900 dark:text-white">
              {format(new Date(), 'HH:mm:ss')}
            </div>

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

              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="lg" className="px-6 py-3">
                    <Plus className="w-4 h-4 mr-2" />
                    Lançar Horas
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingEntry
                        ? 'Editar Registro'
                        : 'Lançar Horas Manualmente'}
                    </DialogTitle>
                    <DialogDescription>
                      Selecione a data e informe os períodos de trabalho.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4">
                    {/* Date Picker */}
                    <div className="space-y-2">
                      <Label>Data</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              'w-full justify-start text-left font-normal',
                              !selectedDate && 'text-muted-foreground',
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {selectedDate
                              ? format(selectedDate, 'dd/MM/yyyy', {
                                  locale: ptBR,
                                })
                              : 'Selecione uma data'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={(date) => date && setSelectedDate(date)}
                            disabled={(date) =>
                              date > new Date() || date < new Date('1900-01-01')
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    {/* Periods */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <Label>Períodos de Trabalho</Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={addPeriod}
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Adicionar Período
                        </Button>
                      </div>

                      <div className="space-y-3">
                        {manualPeriods.map((period, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 p-3 border rounded-lg"
                          >
                            <div className="flex-1 grid grid-cols-2 gap-2">
                              <div>
                                <Label
                                  htmlFor={`clockIn-${index}`}
                                  className="text-xs"
                                >
                                  {index + 1}ª Entrada
                                </Label>
                                <Input
                                  id={`clockIn-${index}`}
                                  type="time"
                                  value={period?.clockIn || ''}
                                  onChange={(e) =>
                                    updatePeriod(
                                      index,
                                      'clockIn',
                                      e.target.value,
                                    )
                                  }
                                />
                              </div>
                              <div>
                                <Label
                                  htmlFor={`clockOut-${index}`}
                                  className="text-xs"
                                >
                                  {index + 1}ª Saída
                                </Label>
                                <Input
                                  id={`clockOut-${index}`}
                                  type="time"
                                  value={period?.clockOut || ''}
                                  onChange={(e) =>
                                    updatePeriod(
                                      index,
                                      'clockOut',
                                      e.target.value,
                                    )
                                  }
                                />
                              </div>
                            </div>
                            {manualPeriods.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removePeriod(index)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Minus className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Preview */}
                    {manualPeriods &&
                      manualPeriods.some(
                        (p) => p && p.clockIn && p.clockOut,
                      ) && (
                        <div className="p-3 dark:bg-background rounded-lg border">
                          <h4 className="font-semibold mb-2">Resumo do Dia:</h4>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span>Períodos válidos:</span>
                              <span className="font-semibold">
                                {
                                  manualPeriods.filter(
                                    (p) => p && p.clockIn && p.clockOut,
                                  ).length
                                }
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Total de horas:</span>
                              <span className="font-semibold">
                                {calculateTotalHours(manualPeriods).toFixed(1)}h
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Saldo do dia:</span>
                              <span
                                className={`font-semibold ${
                                  calculateTotalHours(manualPeriods) -
                                    WORK_HOURS_PER_DAY >=
                                  0
                                    ? 'text-green-600'
                                    : 'text-red-600'
                                }`}
                              >
                                {calculateTotalHours(manualPeriods) -
                                  WORK_HOURS_PER_DAY >=
                                0
                                  ? '+'
                                  : ''}
                                {(
                                  calculateTotalHours(manualPeriods) -
                                  WORK_HOURS_PER_DAY
                                ).toFixed(1)}
                                h
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                    {/* Existing entry info */}
                    {getSelectedDateEntry() && !editingEntry && (
                      <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-sm text-yellow-800 flex gap-2">
                          <TriangleAlert />
                          Já existe um registro para esta data. O lançamento
                          substituirá o registro atual.
                        </p>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button
                        onClick={handleManualEntry}
                        disabled={
                          !manualPeriods ||
                          !manualPeriods.some(
                            (p) => p && p.clockIn && p.clockOut,
                          )
                        }
                        className="flex-1"
                      >
                        {editingEntry ? 'Atualizar' : 'Salvar'}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsDialogOpen(false);
                          setEditingEntry(null);
                          setManualPeriods([{ clockIn: '', clockOut: '' }]);
                        }}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {todayEntry && (
              <div className="text-sm">
                <div className="font-semibold mb-1 text-gray-600 dark:text-gray-100">
                  Períodos de hoje:
                </div>
                <div className="dark:text-green-500 font-semibold">
                  {formatPeriods(todayEntry.periods) ||
                    'Nenhum período registrado'}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Today's Hours */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-100">
                Horas Hoje
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {todayEntry ? (todayEntry.totalHours || 0).toFixed(1) : '0.0'}h
              </div>
              <div className="text-xs text-gray-500 dark:text-green-400 mt-1">
                Meta: {WORK_HOURS_PER_DAY}h
              </div>
            </CardContent>
          </Card>

          {/* Weekly Hours */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-100">
                Horas da Semana
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {weeklyTotals.totalHours.toFixed(1)}h
              </div>
              <div className="text-xs text-gray-500 dark:text-green-400 mt-1">
                Meta: {WORK_HOURS_PER_WEEK}h
              </div>
            </CardContent>
          </Card>

          {/* Extra Hours */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-100 flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                Horas Extras
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                +{overallTotals.extraHours.toFixed(1)}h
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-100 mt-1">
                Acumuladas
              </div>
            </CardContent>
          </Card>

          {/* Missing Hours */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-100 flex items-center gap-1">
                <TrendingDown className="w-4 h-4" />
                Horas Faltantes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                -{overallTotals.missingHours.toFixed(1)}h
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-100 mt-1">
                Acumuladas
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Balance and Recommendations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Balance Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {balance >= 0 ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600" />
                )}
                Saldo de Horas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div
                  className={`text-4xl font-bold ${
                    balance >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {balance >= 0 ? '+' : ''}
                  {balance.toFixed(1)}h
                </div>
                <Badge
                  variant={balance >= 0 ? 'default' : 'destructive'}
                  className="mt-2"
                >
                  {balance >= 0 ? 'Saldo Positivo' : 'Saldo Negativo'}
                </Badge>
              </div>

              <Separator />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Total de horas extras:</span>
                  <span className="font-semibold text-green-600">
                    +{overallTotals.extraHours.toFixed(1)}h
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Total de horas faltantes:</span>
                  <span className="font-semibold text-red-600">
                    -{overallTotals.missingHours.toFixed(1)}h
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recommendations Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5" />
                Recomendações
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {balance < 0 ? (
                <div className="space-y-3">
                  <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                    <h4 className="font-semibold text-red-800 mb-2">
                      Para Compensar o Déficit:
                    </h4>
                    <ul className="text-sm text-red-700 space-y-1">
                      <li>• Trabalhe {hoursToCompensate.toFixed(1)}h extras</li>
                      <li>
                        • Ou {(hoursToCompensate / 5).toFixed(1)}h por dia nos
                        próximos 5 dias
                      </li>
                    </ul>
                  </div>
                </div>
              ) : balance > 0 ? (
                <div className="space-y-3">
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <h4 className="font-semibold text-green-800 mb-2">
                      Você tem crédito de horas!
                    </h4>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>
                        • {extraHoursAvailable.toFixed(1)}h disponíveis para
                        usar
                      </li>
                      <li>
                        • Pode sair {(extraHoursAvailable / 5).toFixed(1)}h mais
                        cedo por 5 dias
                      </li>
                      <li>
                        • Ou tirar {Math.floor(extraHoursAvailable / 8)} dia(s)
                        de folga
                      </li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-2">
                    Parabéns!
                  </h4>
                  <p className="text-sm text-blue-700">
                    Suas horas estão em perfeito equilíbrio. Continue assim!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Entries */}
        <Card>
          <CardHeader>
            <CardTitle>Registros Recentes</CardTitle>
            <CardDescription>Últimos 7 dias de trabalho</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {entries
                .slice(-7)
                .reverse()
                .map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          isToday(parseISO(entry.date))
                            ? 'bg-blue-500'
                            : 'bg-gray-300'
                        }`}
                      />
                      <div>
                        <div className="font-medium">
                          {format(parseISO(entry.date), 'dd/MM/yyyy - EEEE', {
                            locale: ptBR,
                          })}
                        </div>
                        <div className="text-sm text-gray-600">
                          {formatPeriods(entry.periods) || 'Nenhum período'}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="font-semibold">
                          {(entry.totalHours || 0).toFixed(1)}h
                        </div>
                        <div className="text-sm">
                          {(entry.extraHours || 0) > 0 && (
                            <span className="text-green-600">
                              +{(entry.extraHours || 0).toFixed(1)}h
                            </span>
                          )}
                          {(entry.missingHours || 0) > 0 && (
                            <span className="text-red-600">
                              -{(entry.missingHours || 0).toFixed(1)}h
                            </span>
                          )}
                          {(entry.extraHours || 0) === 0 &&
                            (entry.missingHours || 0) === 0 && (
                              <span className="text-gray-500">Normal</span>
                            )}
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditEntry(entry)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteEntry(entry.id)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}

              {entries.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Nenhum registro encontrado. Faça seu primeiro registro de
                  ponto!
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
