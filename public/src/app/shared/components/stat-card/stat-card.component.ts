import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-stat-card',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `
    <div
      class="card h-full p-5"
      [ngClass]="variant === 'warning' ? 'border-l-4 border-l-amber-400' : ''"
    >
      <p class="text-sm text-gray-500">{{ label }}</p>
      <p
        class="mt-2 text-2xl font-semibold tracking-tight"
        [ngClass]="variant === 'warning' ? 'text-amber-600' : 'text-gray-900'"
      >
        {{ value }}
      </p>
      @if (subtext) {
        <p class="mt-1 text-xs text-gray-500">{{ subtext }}</p>
      }
    </div>
  `,
})
export class StatCardComponent {
  @Input({ required: true }) label!: string;
  @Input({ required: true }) value!: string | number;
  @Input() subtext?: string;
  @Input() variant: 'default' | 'warning' = 'default';
}
