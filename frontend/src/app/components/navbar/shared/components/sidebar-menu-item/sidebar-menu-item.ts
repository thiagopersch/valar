import { CommonModule } from '@angular/common';
import { Component, computed, input, signal } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule } from '@angular/router';
import { MenuItem } from '../../model/MenuItem';

@Component({
  selector: 'app-sidebar-menu-item',
  templateUrl: './sidebar-menu-item.html',
  styleUrl: './sidebar-menu-item.css',
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatListModule,
    MatExpansionModule,
    MatMenuModule,
  ],
})
export class SidebarMenuItem {
  item = input.required<MenuItem>();
  collapsed = input<boolean>(false);

  expanded = signal(false);
  isExpanded = computed(() => this.expanded());

  hasChildren = computed(() => !!this.item()?.children?.length);

  toggle(event: Event) {
    event.stopPropagation();
    this.expanded.update((v) => !v);
  }
}
