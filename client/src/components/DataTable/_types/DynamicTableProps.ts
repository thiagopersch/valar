import { ColumnDef } from '@tanstack/react-table';

export type MenuAction = {
  label: string;
  icon?: React.ReactNode;
  tooltip?: string;
  color?: string;
  onClick: (row: any) => void;
};

export type DynamicTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  rows: TData[];
  className?: string;
  isLoading?: boolean;
  addAction?: () => void;
  actions?: MenuAction[];
};
