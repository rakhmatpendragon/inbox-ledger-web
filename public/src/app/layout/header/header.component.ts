import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';

/** Mobile-only top bar with the drawer toggle. */
@Component({
  selector: 'app-header',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="flex h-14 items-center gap-2 border-b border-gray-200 bg-white px-2 lg:hidden">
      <button type="button" class="btn-icon" aria-label="Open navigation" (click)="menuToggle.emit()">
        <mat-icon>menu</mat-icon>
      </button>
      <app-logo size="sm" />
      <span class="font-display text-base font-bold">Inbox Ledger</span>
    </header>
  `,
})
export class HeaderComponent {
  @Output() readonly menuToggle = new EventEmitter<void>();
}
