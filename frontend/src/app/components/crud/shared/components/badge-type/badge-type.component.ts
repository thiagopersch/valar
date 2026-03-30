import { CommonModule } from '@angular/common';
import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-badge-type',
  imports: [CommonModule],
  template: `
    @if (type()) {
      <span
        class="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset"
        [ngClass]="badgeClass()"
      >
        {{ type() }}
      </span>
    }
  `,
})
export class BadgeTypeComponent {
  type = input<string>('');

  badgeClass = computed(() => {
    switch (this.type()?.toLowerCase()) {
      case 'entrada':
      case 'receita':
        return 'bg-green-50 text-green-700 ring-green-600/20';
      case 'saida':
      case 'despesa':
        return 'bg-red-50 text-red-700 ring-red-600/20';
      case 'pendente':
        return 'bg-yellow-50 text-yellow-800 ring-yellow-600/20';
      default:
        return 'bg-gray-50 text-gray-600 ring-gray-500/10';
    }
  });
}
