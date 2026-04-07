export interface ActionsProps {
  label?: string;
  icon?: string;
  tooltip?: string;
  action: (item: any) => void;
  type: 'toggle' | 'delete' | 'default';
  color?: string;
  visible?: boolean | ((item: any) => boolean);
}

export interface ColumnDefinitionsProps {
  key: string;
  header: string;
  type:
    | 'text'
    | 'number'
    | 'boolean'
    | 'date'
    | 'datetime'
    | 'email'
    | 'phone'
    | 'url'
    | 'color'
    | 'YesNo'
    | 'situation'
    | 'typeEntry'
    | 'sex'
    | 'cpf'
    | 'cnpj'
    | 'currency';
}

export interface TableField {
  [key: string]: any;
}
