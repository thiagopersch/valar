export interface ToastData {
  message: string;
  action: string;
  icon: string;
  style?: 'primary' | 'success' | 'tertiary' | 'error' | 'warn';
  variant?: 'text' | 'filled' | 'elevated' | 'outlined' | 'tonal';
}
