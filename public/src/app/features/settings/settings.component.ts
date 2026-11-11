import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
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

  copyAddress(address: string): void {
    this.clipboard.copy(address);
    this.snackBar.open('Copied!', undefined, { duration: 2000 });
  }

  async signOut(): Promise<void> {
    await this.auth.logout();
    await this.router.navigate(['/']);
  }
}

