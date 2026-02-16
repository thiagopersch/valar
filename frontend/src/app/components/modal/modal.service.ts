import { ComponentType } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  constructor(private dialog: MatDialog) {}

  openModal(
    id: string,
    component: ComponentType<any>,
    title: string,
    width: boolean,
    height: boolean,
    data: any,
    panelClass: string,
    disableClose: boolean,
  ) {
    return this.dialog.open(component, {
      id: id,
      data: { title, ...data },
      panelClass: panelClass,
      disableClose: disableClose,
      width: width ? '80%' : 'auto',
      maxWidth: '95vw',
    });
  }
}
