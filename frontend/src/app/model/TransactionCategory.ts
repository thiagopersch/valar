export interface TransactionCategory {
  id: string;
  name: string;
  description?: string;
  type: TransactionCategoryType;
  color: string;
  icon: string;
  status: boolean;
  created_at?: string;
  updated_at?: string;
}

export enum TransactionCategoryType {
  INCOME = 'income',
  EXPENSE = 'expense',
}
