import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import React, { ReactNode } from 'react';

type CustomModalProps = {
  onClose?: () => void;
  title: string;
  showCloseButton?: boolean;
  disableBackdropClick?: boolean;
  open: boolean;
  children: ReactNode;
};

const CustomModal: React.FC<CustomModalProps> = ({
  onClose,
  title,
  showCloseButton = true,
  disableBackdropClick = false,
  open,
  children,
}) => {
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen && onClose) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="p-4 shadow-xl"
        showCloseButton={showCloseButton}
        onInteractOutside={(e) => {
          if (disableBackdropClick) {
            e.preventDefault();
          }
        }}
        onEscapeKeyDown={(e) => {
          if (disableBackdropClick) {
            e.preventDefault();
          }
        }}
      >
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-lg font-bold">{title}</DialogTitle>
        </DialogHeader>
        <Separator />
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default CustomModal;
