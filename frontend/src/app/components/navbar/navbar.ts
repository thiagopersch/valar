import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NavigationEnd, Router, RouterModule, Routes } from '@angular/router';
import { filter, map } from 'rxjs';
import { SidebarMenuItem } from './shared/components/sidebar-menu-item/sidebar-menu-item';
import { MenuItem } from './shared/model/MenuItem';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatBadgeModule,
    MatMenuModule,
    SidebarMenuItem,
  ],
})
export class Navbar {
  router = inject(Router);

  collapsed = signal(false);
  sidebarWidth = computed(() => (this.collapsed() ? 'w-20' : 'w-64'));

  currentRouteTitle = signal<string>('Sistema');

  menuItems = signal<MenuItem[]>([]);

  user = {
    name: 'Tiago Peixoto',
    email: 'tiago@example.com',
    initials: 'TP',
  };

  constructor() {
    this.menuItems.set(this.buildMenuTree(this.router.config));
    this.router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        map(() => this.getActiveTitle()),
      )
      .subscribe((title) => this.currentRouteTitle.set(title || 'Sistema'));
  }

  toggleSidebar() {
    this.collapsed.update((v) => !v);
  }

  logout() {
    this.router.navigate(['/login']);
  }

  private buildMenuTree(routes: Routes, parentPath: string = '', isChild = false): MenuItem[] {
    const menu: MenuItem[] = [];
    const seenIds = new Set<string>();

    for (const route of routes) {
      if (route.path === '**' || route.redirectTo || route.path === 'login') continue;

      if (route.path === '') {
        if (route.children) {
          const childItems = this.buildMenuTree(route.children, parentPath, true);
          childItems.forEach((child) => {
            if (!seenIds.has(child.id)) {
              menu.push(child);
              seenIds.add(child.id);
            }
          });
        }
        continue;
      }

      if (!route.title) continue;

      if (!isChild && !route.data?.['showInNavbar']) continue;

      const pathSegment = route.path ?? '';
      const fullPath = `${parentPath}/${pathSegment}`.replace(/\/+/g, '/');
      const id = fullPath.replace(/^\//, '').replace(/\//g, '-') || 'home';

      if (seenIds.has(id)) continue;

      let children: MenuItem[] = [];
      if (route.children?.length) {
        children = this.buildMenuTree(route.children, fullPath, true);
      }

      if (children.length === 1 && children[0].title === route.title) {
        children = children[0].children ?? [];
      }

      menu.push({
        id,
        title: route.title as string,
        icon: (route.data?.['icon'] as string) ?? 'circle',
        path: fullPath,
        children: children.length ? children : undefined,
      });

      seenIds.add(id);
    }

    return menu;
  }

  private getActiveTitle(): string | undefined {
    let route = this.router.routerState.root;
    let title: string | undefined;
    while (route.firstChild) {
      route = route.firstChild;
      title = route.snapshot.title ?? route.snapshot.data['title'];
    }
    return title;
  }
}
