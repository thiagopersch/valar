import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon, Plus } from 'lucide-react';
import { PeriodInput } from './period-input';

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

interface ManualEntryDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  manualPeriods: TimePeriod[];
  onPeriodsChange: (periods: TimePeriod[]) => void;
  editingEntry: TimeEntry | null;
  onSave: () => void;
  onCancel: () => void;
  calculateTotalHours: (periods: TimePeriod[]) => number;
  getSelectedDateEntry: () => TimeEntry | undefined;
  WORK_HOURS_PER_DAY: number;
}

export function ManualEntryDialog({
  isOpen,
  onOpenChange,
  selectedDate,
  onDateSelect,
  manualPeriods,
  onPeriodsChange,
  editingEntry,
  onSave,
  onCancel,
  calculateTotalHours,
  getSelectedDateEntry,
  WORK_HOURS_PER_DAY,
}: ManualEntryDialogProps) {
  const addPeriod = () => {
    onPeriodsChange([...manualPeriods, { clockIn: '', clockOut: '' }]);
  };

  const removePeriod = (index: number) => {
    if (manualPeriods.length > 1) {
      onPeriodsChange(manualPeriods.filter((_, i) => i !== index));
    }
  };

  const updatePeriod = (
    index: number,
    field: 'clockIn' | 'clockOut',
    value: string,
  ) => {
    const updated = manualPeriods.map((period, i) =>
      i === index ? { ...period, [field]: value } : period,
    );
    onPeriodsChange(updated);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="lg"
          className="px-6 py-3 bg-transparent border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          <Plus className="w-4 h-4 mr-2" />
          Lançar Horas
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-gray-900 dark:text-white">
            {editingEntry ? 'Editar Registro' : 'Lançar Horas Manualmente'}
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            Selecione a data e informe os períodos de trabalho.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Date Picker */}
          <div>
            <Label className="text-gray-700 dark:text-gray-300">Data</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700',
                    !selectedDate && 'text-muted-foreground dark:text-gray-500',
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate
                    ? format(selectedDate, 'dd/MM/yyyy', { locale: ptBR })
                    : 'Selecione uma data'}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto p-0 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                align="start"
              >
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && onDateSelect(date)}
                  disabled={(date) =>
                    date > new Date() || date < new Date('1900-01-01')
                  }
                  initialFocus
                  className="bg-white dark:bg-gray-800"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Periods */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <Label className="text-gray-700 dark:text-gray-300">
                Períodos de Trabalho
              </Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addPeriod}
                className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <Plus className="w-4 h-4 mr-1" />
                Adicionar Período
              </Button>
            </div>

            <div className="space-y-3">
              {manualPeriods.map((period, index) => (
                <PeriodInput
                  key={index}
                  period={period}
                  index={index}
                  canRemove={manualPeriods.length > 1}
                  onUpdate={updatePeriod}
                  onRemove={removePeriod}
                />
              ))}
            </div>
          </div>

          {/* Preview */}
          {manualPeriods &&
            manualPeriods.some((p) => p && p.clockIn && p.clockOut) && (
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">
                  Resumo do Dia:
                </h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between text-gray-700 dark:text-gray-300">
                    <span>Períodos válidos:</span>
                    <span className="font-semibold">
                      {
                        manualPeriods.filter(
                          (p) => p && p.clockIn && p.clockOut,
                        ).length
                      }
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-700 dark:text-gray-300">
                    <span>Total de horas:</span>
                    <span className="font-semibold">
                      {calculateTotalHours(manualPeriods).toFixed(1)}h
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-700 dark:text-gray-300">
                    <span>Saldo do dia:</span>
                    <span
                      className={`font-semibold ${
                        calculateTotalHours(manualPeriods) -
                          WORK_HOURS_PER_DAY >=
                        0
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-red-600 dark:text-red-400'
                      }`}
                    >
                      {calculateTotalHours(manualPeriods) -
                        WORK_HOURS_PER_DAY >=
                      0
                        ? '+'
                        : ''}
                      {(
                        calculateTotalHours(manualPeriods) - WORK_HOURS_PER_DAY
                      ).toFixed(1)}
                      h
                    </span>
                  </div>
                </div>
              </div>
            )}

          {/* Existing entry info */}
          {getSelectedDateEntry() && !editingEntry && (
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                ⚠️ Já existe um registro para esta data. O lançamento
                substituirá o registro atual.
              </p>
            </div>
          )}

          <div className="flex gap-2">
            <Button
              onClick={onSave}
              disabled={
                !manualPeriods ||
                !manualPeriods.some((p) => p && p.clockIn && p.clockOut)
              }
              className="flex-1"
            >
              {editingEntry ? 'Atualizar' : 'Salvar'}
            </Button>
            <Button
              variant="outline"
              onClick={onCancel}
              className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancelar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
