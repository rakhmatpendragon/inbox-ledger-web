import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

export type BadgeTone = 'brand' | 'blue' | 'gray' | 'yellow' | 'red';

/** Default tone per known label (receipt statuses). Sources and anything else are neutral. */
const TONE_BY_LABEL: Record<string, BadgeTone> = {
  Parsed: 'brand',
  Processing: 'blue',
  Duplicate: 'gray',
  Failed: 'red',
};

const TONE_CLASSES: Record<BadgeTone, string> = {
  brand: 'bg-brand-50 text-brand-600 font-medium',
  blue: 'bg-info-50 text-info-700 font-medium',
  gray: 'bg-gray-100 text-gray-700',
  yellow: 'bg-amber-50 text-warn-700 font-medium',
  red: 'bg-danger-50 text-danger-700 font-medium',
};

@Component({
  selector: 'app-badge',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span
      class="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs"
      [ngClass]="classes"
    >
      <ng-content />{{ label }}
    </span>
  `,
})
export class BadgeComponent {
  @Input({ required: true }) label!: string;
  /** Overrides the tone inferred from the label. */
  @Input() tone?: BadgeTone;

  get classes(): string {
    return TONE_CLASSES[this.tone ?? TONE_BY_LABEL[this.label] ?? 'gray'];
  }
}
