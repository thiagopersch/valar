import { CommonModule } from '@angular/common';
import { Component, computed, input, signal, inject, OnInit, DestroyRef } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
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
export class SidebarMenuItem implements OnInit {
  item = input.required<MenuItem>();
  collapsed = input<boolean>(false);

  expanded = signal(false);
  isExpanded = computed(() => this.expanded());

  hasChildren = computed(() => !!this.item()?.children?.length);

  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  ngOnInit() {
    this.checkExpanded();

    this.router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        this.checkExpanded();
      });
  }

  checkExpanded() {
    const path = this.item().path;
    if (this.hasChildren() && path) {
      const isActive = this.router.isActive(path, {
        paths: 'subset',
        queryParams: 'ignored',
        fragment: 'ignored',
        matrixParams: 'ignored',
      });
      if (isActive) {
        this.expanded.set(true);
      }
    }
  }

  toggle(event: Event) {
    event.stopPropagation();
    this.expanded.update((v) => !v);
  }
}
