import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-stat-card',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `
    <div class="card flex h-full flex-col gap-2 p-5">
      <span class="inline-flex items-center gap-2 text-[13px] text-gray-600">
        @if (dot) {
          <span class="h-2 w-2 shrink-0 rounded-full" [style.background]="dot"></span>
        }
        {{ label }}
      </span>
      <span class="font-display text-[28px] font-semibold leading-tight text-gray-900">{{ value }}</span>
      @if (subtext) {
        <span class="text-xs text-gray-600">{{ subtext }}</span>
      }
    </div>
  `,
})
export class StatCardComponent {
  @Input({ required: true }) label!: string;
  @Input({ required: true }) value!: string | number;
  @Input() subtext?: string;
  /** Optional status dot colour shown before the label. */
  @Input() dot?: string;
}
