import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Modal } from './modal';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  constructor(private dialog: MatDialog) {}

  /**
   * Modal para ser usado em toda a aplicação
   * @param id campo usado para identificar o modal
   * @param customContent Componente customizado para o conteudo do modal
   * @param title Titulo para o header do modal
   * @param isHandleClose Valor para habilitar ou desabilitar o botão de fechar no header
   * @param disableClose Desabilita o fechamento clicando fora do modal
   * @param data Dados do modal
   * @param customClassContainer Classe CSS para o container
   * @param enableFullscreen Habilita o botão de tela cheia
   * @param width Largura do modal (opcional, padrão: '60dvw')
   * @param height Altura do modal (opcional, padrão: 'auto')
   * @returns
   */
  openModal(
    id?: string,
    customContent?: any,
    title: string = '',
    isHandleClose: boolean = false,
    disableClose: boolean = true,
    data?: Record<string, any>,
    customClassContainer?: string | string[],
    enableFullscreen: boolean = false,
    width: string = 'auto',
    height: string = 'auto',
  ) {
    const isMobile = window.innerWidth <= 768 || window.innerHeight <= 600;
    const panelClasses = Array.isArray(customClassContainer)
      ? [...customClassContainer, 'responsive-modal']
      : customClassContainer
        ? [customClassContainer, 'responsive-modal']
        : ['responsive-modal'];

    const dialogConfig: MatDialogConfig = {
      width: isMobile ? '100dvw' : width,
      height: isMobile ? '100dvh' : height,
      maxWidth: '100dvw',
      maxHeight: '90vh',
      role: 'dialog',
      autoFocus: false,
      disableClose: disableClose,
      panelClass: panelClasses,
      data: {
        id,
        customContent,
        title,
        isHandleClose,
        customClassContainer,
        enableFullscreen,
        width,
        height,
        ...data,
      },
    };

    return this.dialog.open<Modal>(Modal, dialogConfig);
  }
}
