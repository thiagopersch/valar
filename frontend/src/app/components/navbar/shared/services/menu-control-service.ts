import { Injectable } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';

interface MenuLevel {
  trigger: MatMenuTrigger;
  level: number;
  parentTrigger?: MatMenuTrigger;
}

@Injectable({
  providedIn: 'root',
})
export class MenuControlService {
  private openMenus: MenuLevel[] = [];

  /**
   * Registra um menu como aberto
   * Fecha automaticamente menus do mesmo nível ou níveis mais profundos
   */
  registerOpen(trigger: MatMenuTrigger, level: number, parentTrigger?: MatMenuTrigger) {
    // Fecha todos os menus do mesmo nível ou mais profundos
    this.closeMenusFromLevel(level);

    // Adiciona o novo menu à lista
    this.openMenus.push({ trigger, level, parentTrigger });
  }

  /**
   * Fecha todos os menus a partir de um determinado nível
   */
  private closeMenusFromLevel(level: number) {
    const menusToClose = this.openMenus.filter((menu) => menu.level >= level);

    menusToClose.forEach((menu) => {
      try {
        menu.trigger.closeMenu();
      } catch (e) {
        // Ignora erros se o menu já estiver fechado
      }
    });

    // Remove os menus fechados da lista
    this.openMenus = this.openMenus.filter((menu) => menu.level < level);
  }

  /**
   * Remove um menu específico da lista
   */
  onMenuClosed(trigger: MatMenuTrigger) {
    this.openMenus = this.openMenus.filter((menu) => menu.trigger !== trigger);
  }

  /**
   * Fecha todos os menus
   */
  closeAll() {
    this.openMenus.forEach((menu) => {
      try {
        menu.trigger.closeMenu();
      } catch (e) {
        // Ignora erros
      }
    });
    this.openMenus = [];
  }

  /**
   * Verifica se um menu está aberto
   */
  isOpen(trigger: MatMenuTrigger): boolean {
    return this.openMenus.some((menu) => menu.trigger === trigger);
  }
}
