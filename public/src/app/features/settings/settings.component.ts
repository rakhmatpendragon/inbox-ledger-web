import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Clipboard } from '@angular/cdk/clipboard';
import { MatSnackBar } from '@angular/material/snack-bar';

import { environment } from '@env/environment';
import { AuthService } from '@app/core/auth/auth.service';

@Component({
  selector: 'app-settings',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './settings.component.html',
})
export class SettingsComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly clipboard = inject(Clipboard);
  private readonly snackBar = inject(MatSnackBar);

  readonly user$ = this.auth.user$;
  readonly fallbackAddress = environment.receiptsAddress;

  readonly pushAlertsEnabled = signal(true);
  readonly duplicateProtectionEnabled = signal(true);
  /** True briefly after the receipts address was copied. */
  readonly copied = signal(false);
  private copiedTimer?: ReturnType<typeof setTimeout>;

  constructor() {
    inject(DestroyRef).onDestroy(() => clearTimeout(this.copiedTimer));
  }

  copyAddress(address: string): void {
    if (!this.clipboard.copy(address)) {
      this.snackBar.open('Could not copy address', 'Dismiss', { duration: 3500 });
      return;
    }
    this.copied.set(true);
    clearTimeout(this.copiedTimer);
    this.copiedTimer = setTimeout(() => this.copied.set(false), 2000);
  }

  async signOut(): Promise<void> {
    await this.auth.logout();
    await this.router.navigate(['/']);
  }
}

