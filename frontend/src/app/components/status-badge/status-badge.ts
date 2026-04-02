import { CommonModule } from '@angular/common';
import { Component, computed, input } from '@angular/core';

export type BadgeSize = 'sm' | 'md' | 'lg';
export type BadgeVariant = 'success' | 'danger' | 'warning' | 'info' | 'neutral';

export interface BadgeConfig {
  when: boolean | string | ((value: any) => boolean);
  label: string;
  variant: BadgeVariant;
  animated?: boolean;
}

const VARIANT_CLASSES: Record<BadgeVariant, { badge: string; dot: string; ping: string }> = {
  success: {
    badge: 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20',
    dot: 'bg-green-500',
    ping: 'bg-green-400',
  },
  danger: {
    badge: 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20',
    dot: 'bg-red-500',
    ping: 'bg-red-400',
  },
  warning: {
    badge: 'bg-yellow-50 text-yellow-800 ring-1 ring-inset ring-yellow-600/20',
    dot: 'bg-yellow-500',
    ping: 'bg-yellow-400',
  },
  info: {
    badge: 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20',
    dot: 'bg-blue-500',
    ping: 'bg-blue-400',
  },
  neutral: {
    badge: 'bg-gray-50 text-gray-600 ring-1 ring-inset ring-gray-500/10',
    dot: 'bg-gray-400',
    ping: 'bg-gray-300',
  },
};

const SIZE_CLASSES: Record<BadgeSize, { badge: string; dot: string }> = {
  sm: { badge: 'px-2 py-0.5 text-[11px] gap-1.5', dot: 'size-1.5' },
  md: { badge: 'px-2.5 py-1 text-xs gap-2', dot: 'size-2' },
  lg: { badge: 'px-3 py-1.5 text-sm gap-2.5', dot: 'size-2.5' },
};

@Component({
  selector: 'app-status-badge',
  templateUrl: './status-badge.html',
  styleUrl: './status-badge.css',
  imports: [CommonModule],
})
export class StatusBadge {
  value = input.required<any>();
  activeLabel = input<string>('Ativado');
  inactiveLabel = input<string>('Desativado');
  size = input<BadgeSize>('md');
  animated = input<boolean>(true);
  configs = input<BadgeConfig[]>([]);
  defaultVariant = input<BadgeVariant>('neutral');
  defaultLabel = input<string | null>(null);
  hideDot = input<boolean>(false);
  className = input<string>('');

  private resolvedConfig = computed<BadgeConfig | null>(() => {
    const cfgs = this.configs();
    const val = this.value();
    if (!cfgs.length) return null;

    return (
      cfgs.find((cfg) => {
        if (typeof cfg.when === 'function') return cfg.when(val);
        if (typeof cfg.when === 'string')
          return String(val).toLowerCase() === cfg.when.toLowerCase();
        return cfg.when === val;
      }) ?? null
    );
  });

  variant = computed<BadgeVariant>(() => {
    const cfg = this.resolvedConfig();
    if (cfg) return cfg.variant;
    if (this.configs().length) return this.defaultVariant();
    return this.value() ? 'success' : 'danger';
  });

  label = computed<string>(() => {
    const cfg = this.resolvedConfig();
    if (cfg) return cfg.label;
    if (this.defaultLabel() !== null) return this.defaultLabel()!;
    return this.value() ? this.activeLabel() : this.inactiveLabel();
  });

  showPing = computed<boolean>(() => {
    const cfgAnimated = this.resolvedConfig()?.animated;
    const isAnimated = cfgAnimated !== undefined ? cfgAnimated : this.animated();
    return isAnimated && this.variant() === 'success';
  });

  badgeClass = computed<string>(() =>
    [
      'inline-flex items-center rounded-full font-medium',
      VARIANT_CLASSES[this.variant()].badge,
      SIZE_CLASSES[this.size()].badge,
      this.className(),
    ]
      .filter(Boolean)
      .join(' '),
  );

  dotClass = computed<string>(() =>
    [
      'rounded-full shrink-0 relative z-10',
      VARIANT_CLASSES[this.variant()].dot,
      SIZE_CLASSES[this.size()].dot,
    ].join(' '),
  );

  pingClass = computed<string>(() =>
    [
      'absolute inset-0 rounded-full opacity-75 animate-ping',
      VARIANT_CLASSES[this.variant()].ping,
    ].join(' '),
  );
}
