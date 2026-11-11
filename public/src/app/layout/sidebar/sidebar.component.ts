import { ChangeDetectionStrategy, Component, EventEmitter, Output, inject } from '@angular/core';

import { AuthService } from '@app/core/auth/auth.service';

interface NavItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block h-full' },
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  private readonly auth = inject(AuthService);

  /** Emitted when a nav link is clicked (closes the drawer on mobile). */
  @Output() readonly navigate = new EventEmitter<void>();

  readonly user$ = this.auth.user$;

  readonly navItems: readonly NavItem[] = [
    { label: 'Dashboard', icon: 'dashboard', route: '/app/dashboard' },
    { label: 'Transactions', icon: 'receipt_long', route: '/app/transactions' },
    { label: 'Receipts', icon: 'mail', route: '/app/receipts' },
    { label: 'Budgets', icon: 'savings', route: '/app/budgets' },
    { label: 'Settings', icon: 'settings', route: '/app/settings' },
  ];
}

