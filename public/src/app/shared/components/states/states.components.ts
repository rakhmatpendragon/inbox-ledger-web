import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

/** Skeleton placeholder shown while data loads. */
@Component({
  selector: 'app-loading-state',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block', role: 'status', 'aria-live': 'polite' },
  template: `
    <div class="animate-pulse space-y-3 p-4">
      @for (row of rowsArray; track $index) {
        <div class="h-4 rounded bg-gray-200" [style.width.%]="100 - ($index % 3) * 15"></div>
      }
      <span class="sr-only">Loading…</span>
    </div>
  `,
})
export class LoadingStateComponent {
  @Input() rows = 4;

  get rowsArray(): number[] {
    return Array.from({ length: this.rows }, (_, i) => i);
  }
}

/** Shown when a list has no data. */
@Component({
  selector: 'app-empty-state',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `
    <div class="flex flex-col items-center justify-center px-4 py-12 text-center">
      <span class="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400">
        <mat-icon>{{ icon }}</mat-icon>
      </span>
      <p class="text-sm font-medium text-gray-900">{{ title }}</p>
      @if (message) {
        <p class="mt-1 max-w-sm text-sm text-gray-500">{{ message }}</p>
      }
    </div>
  `,
})
export class EmptyStateComponent {
  @Input() icon = 'inbox';
  @Input({ required: true }) title!: string;
  @Input() message?: string;
}

/** Shown when loading fails, with a retry action. */
@Component({
  selector: 'app-error-state',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block', role: 'alert' },
  template: `
    <div class="flex flex-col items-center justify-center px-4 py-12 text-center">
      <span class="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-500">
        <mat-icon>error_outline</mat-icon>
      </span>
      <p class="text-sm font-medium text-gray-900">Couldn't load this section</p>
      <p class="mt-1 max-w-sm text-sm text-gray-500">{{ message }}</p>
      <button mat-stroked-button class="mt-4" (click)="retry.emit()">
        <mat-icon>refresh</mat-icon>
        Try again
      </button>
    </div>
  `,
})
export class ErrorStateComponent {
  @Input() message = 'Something went wrong. Please try again.';
  @Output() readonly retry = new EventEmitter<void>();
}

