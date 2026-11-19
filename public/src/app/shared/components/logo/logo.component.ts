import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

/** Inbox Ledger mark: envelope glyph on a rounded square. */
@Component({
  selector: 'app-logo',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'inline-flex shrink-0' },
  template: `
    <span
      class="flex items-center justify-center"
      [ngClass]="[
        inverse ? 'bg-white' : 'bg-brand-600',
        size === 'lg' ? 'h-9 w-9 rounded-[9px]' : size === 'sm' ? 'h-7 w-7 rounded-md' : 'h-8 w-8 rounded-lg'
      ]"
    >
      <svg
        [attr.width]="size === 'lg' ? 20 : size === 'sm' ? 16 : 18"
        [attr.height]="size === 'lg' ? 20 : size === 'sm' ? 16 : 18"
        viewBox="0 0 24 24"
        fill="none"
        [attr.stroke]="inverse ? '#0F766E' : '#FFFFFF'"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="M4 4h16v16H4z" />
        <path d="M4 8l8 5 8-5" />
      </svg>
    </span>
  `,
})
export class LogoComponent {
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  /** White tile with a teal glyph, for use on brand-coloured backgrounds. */
  @Input() inverse = false;
}
