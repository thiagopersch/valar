import { ToastData } from './Toast';

export interface ModalAction {
  label: string;
  action?: () => void;
  type?: 'button' | 'submit' | 'reset';
  style?: ToastData['style'];
  variant?: ToastData['variant'];
  disabled?: boolean;
}

export interface ModalIconAction {
  icon: string;
  tooltip?: string;
  action?: () => void;
  style?: ToastData['style'];
  disabled?: boolean;
}
