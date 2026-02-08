import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

const GRID_COLUMNS: Record<number, string> = {
  1: 'md:grid-cols-1',
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-3',
  4: 'md:grid-cols-4',
  5: 'md:grid-cols-5',
  6: 'md:grid-cols-6',
  7: 'md:grid-cols-7',
  8: 'md:grid-cols-8',
  9: 'md:grid-cols-9',
  10: 'md:grid-cols-10',
  11: 'md:grid-cols-11',
  12: 'md:grid-cols-12',
};

@Component({
  selector: 'app-column',
  templateUrl: './column.html',
  styleUrl: './column.css',
  imports: [CommonModule],
  host: {
    class: 'block w-full max-w-full my-2',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Column {
  columns = input<number, number | string>(12, {
    transform: (value) => {
      const num = typeof value === 'string' ? parseInt(value, 10) : value;
      return Math.max(1, Math.min(num || 1, 12));
    },
  });

  gridClass = computed(() => {
    return [
      'grid gap-4 w-full',
      'grid-cols-1', // Padrão mobile (conforme seu SCSS)
      GRID_COLUMNS[this.columns()], // Desktop baseado no input
    ].join(' ');
  });
}
