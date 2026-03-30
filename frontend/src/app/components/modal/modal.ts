import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  HostBinding,
  Inject,
  Injector,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ModalAction, ModalIconAction } from 'app/model/Modal';
import { buttonStyleMap, iconButtonStyleMap } from 'app/styles/styleMapComponents';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.html',
  styleUrl: './modal.css',
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule, MatTooltipModule],
})
export class Modal implements OnInit {
  @Input() title: string = '';
  @Input() actions: ModalAction[] = [];
  @Input() loading: boolean = false;

  isFullscreen: boolean = false;

  @HostBinding('class.fullscreen-wrapper')
  get fullscreenClass() {
    return this.isFullscreen;
  }

  @ViewChild('customContent', { static: false }) customContent: any;

  contentInjector: Injector;

  constructor(
    public dialogRef: MatDialogRef<Modal>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cdr: ChangeDetectorRef,
    private injector: Injector,
  ) {
    this.contentInjector = Injector.create({
      parent: this.injector,
      providers: [
        { provide: MatDialogRef, useValue: this.dialogRef },
        { provide: MAT_DIALOG_DATA, useValue: this.data },
      ],
    });
  }

  ngOnInit(): void {
    if (this.data?.actions) {
      this.actions = this.data.actions;
    }
    if (this.actions.length < 2) {
      console.warn('The Modal component requires at least 2 actions (e.g., Save/Cancel).');
    }
  }

  handleAction(action: ModalAction): void {
    if (action.action) {
      action.action();
    }
  }

  getButtonClass(action: ModalAction): string {
    const base = ['rounded-lg!', 'max-md:w-full!'];
    const style = action.style;

    if (style && style !== 'primary' && buttonStyleMap[style]) {
      const variant = action.variant ?? 'basic';
      const styleClass = buttonStyleMap[style][variant] ?? buttonStyleMap[style]['basic'];
      base.push(styleClass);
    }

    return base.join(' ');
  }

  getIconButtonClass(style?: ModalIconAction['style']): string {
    if (!style || style === 'primary') return '';
    return iconButtonStyleMap[style] ?? '';
  }

  closeModal(): void {
    this.dialogRef.close();
  }

  toggleFullscreen(): void {
    this.isFullscreen = !this.isFullscreen;

    if (this.customContent && this.customContent.onFullscreenChange) {
      this.customContent.onFullscreenChange(this.isFullscreen);
    }

    if (this.isFullscreen) {
      this.dialogRef.addPanelClass('fullscreen-modal');
    } else {
      this.dialogRef.removePanelClass('fullscreen-modal');
    }

    this.cdr.detectChanges();
  }
}
