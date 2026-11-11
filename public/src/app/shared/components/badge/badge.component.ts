import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

export type BadgeTone = 'green' | 'blue' | 'gray' | 'yellow' | 'red';

/** Default tone per known label (sources and receipt statuses). */
const TONE_BY_LABEL: Record<string, BadgeTone> = {
  QRIS: 'green',
  Parsed: 'green',
  Live: 'green',
  'E-wallet': 'blue',
  'Bank transfer': 'gray',
  Bank: 'gray',
  Processing: 'gray',
  Duplicate: 'yellow',
  Failed: 'red',
};

const TONE_CLASSES: Record<BadgeTone, string> = {
  green: 'bg-green-50 text-green-700 ring-green-600/20',
  blue: 'bg-blue-50 text-blue-700 ring-blue-600/20',
  gray: 'bg-gray-100 text-gray-700 ring-gray-500/20',
  yellow: 'bg-amber-50 text-amber-800 ring-amber-600/20',
  red: 'bg-red-50 text-red-700 ring-red-600/20',
};

@Component({
  selector: 'app-badge',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span
      class="inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset"
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

