import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-card',
  templateUrl: './card.html',
  styleUrl: './card.css',
  imports: [CommonModule, MatCardModule],
})
export class Card {
  title = input<string>('');
  subtitle = input<string>('');
  customClass = input<string>('');
  showActions = input<boolean>(false);
  apparence = input<'outlined' | 'raised' | 'filled'>('raised');
}
