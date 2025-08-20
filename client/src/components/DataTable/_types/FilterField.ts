export interface FilterField {
  label: string;
  controlName: string;
  type: 'text' | 'select' | 'range' | 'dateRange' | 'number' | 'boolean' | 'date';
  placeholder?: string;
  options?: { label: string; value: string }[];
  min?: number;
  max?: number;
  step?: number;
  onFilterChange?: (controlName: string, value: any) => void;
}
