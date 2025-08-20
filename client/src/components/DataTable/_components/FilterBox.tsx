'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { cn } from '@/lib/utils';
import { CalendarIcon, Filter } from 'lucide-react';
import { useEffect, useState } from 'react';
import { FilterField } from '../_types/FilterField';

interface FilterBoxProps {
  fields: FilterField[];
  filters: Record<string, any>;
  setFilters: (filters: Record<string, any>) => void;
  openFilter: boolean;
  setOpenFilter: (open: boolean) => void;
  onApplyFilters: (filters: Record<string, any>) => void;
}

export function FilterBox({ fields, filters, setFilters, openFilter, setOpenFilter, onApplyFilters }: FilterBoxProps) {
  const [localFilters, setLocalFilters] = useState<Record<string, any>>({});

  useEffect(() => {
    setLocalFilters({ ...filters });
  }, [filters]);

  const handleFilterChange = (controlName: string, value: any) => {
    setLocalFilters((prev) => ({ ...prev, [controlName]: value }));
  };

  const resetFilters = () => {
    const resetValues = fields.reduce(
      (acc, field) => {
        acc[field.controlName] = '';
        return acc;
      },
      {} as Record<string, any>,
    );
    setLocalFilters(resetValues);
    setFilters({});
    onApplyFilters({});
  };

  const applyFilters = () => {
    const normalizedFilters = fields.reduce(
      (acc, field) => {
        let value = localFilters[field.controlName];
        if (value === '' || value === undefined || value === null) {
          return acc;
        }

        if (field.type === 'select') {
          if (value === 'true') {
            value = true;
          } else if (value === 'false') {
            value = false;
          }
        }

        acc[field.controlName] = value;
        return acc;
      },
      {} as Record<string, any>,
    );
    setFilters(normalizedFilters);
    onApplyFilters(normalizedFilters);
    setOpenFilter(false);
  };

  return (
    <Dialog open={openFilter} onOpenChange={setOpenFilter}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 w-8 p-0">
          <Filter className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Filtros</DialogTitle>
          <DialogDescription>Ajuste os filtros para encontrar o que procura.</DialogDescription>
        </DialogHeader>
        <Separator />
        <div className="grid max-h-[70vh] grid-cols-2 gap-4 overflow-y-auto pr-2">
          {fields.map((field) => (
            <div key={field.controlName} className="flex-1 space-y-2">
              <Label>{field.label}</Label>
              {field.type === 'select' && (
                <Select
                  value={localFilters[field.controlName]?.toString() || ''}
                  onValueChange={(value) => handleFilterChange(field.controlName, value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={field.placeholder || `Selecione ${field.label}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options &&
                      field.options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              )}
              {field.type === 'text' && (
                <Input
                  value={localFilters[field.controlName] || ''}
                  onChange={(e) => handleFilterChange(field.controlName, e.target.value)}
                  placeholder={field.placeholder || `Filtrar por ${field.label}`}
                />
              )}
              {field.type === 'date' && (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={'outline'}
                      className={cn(
                        'w-[240px] justify-start text-left font-normal',
                        !localFilters[field.controlName] && 'text-muted-foreground',
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {localFilters[field.controlName] ? (
                        format(new Date(localFilters[field.controlName]), 'PPP', { locale: ptBR })
                      ) : (
                        <span>Escolha uma data</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={localFilters[field.controlName] ? new Date(localFilters[field.controlName]) : undefined}
                      onSelect={(date) => handleFilterChange(field.controlName, date?.toISOString())}
                      initialFocus
                      locale={ptBR}
                    />
                  </PopoverContent>
                </Popover>
              )}
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={resetFilters}>
            Limpar Filtros
          </Button>
          <Button onClick={applyFilters}>Filtrar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
