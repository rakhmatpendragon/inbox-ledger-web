import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize } from 'rxjs';

import { environment } from '@env/environment';
import { AuthService } from '@app/core/auth/auth.service';

@Component({
  selector: 'app-landing',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './landing.component.html',
})
export class LandingComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  readonly signingIn = signal(false);
  readonly receiptsAddress = environment.receiptsAddress;
  readonly appUrl = environment.appUrl;

  readonly features: readonly { icon: string; text: string }[] = [
    { icon: 'forward_to_inbox', text: `Forward to ${environment.receiptsAddress}` },
    { icon: 'category', text: 'Each receipt becomes a categorized transaction' },
    { icon: 'notifications_active', text: 'Get a push alert when a budget is close' },
  ];

  signIn(): void {
    if (this.signingIn()) {
      return;
    }
    this.signingIn.set(true);
    this.auth
      .loginWithGoogle()
      .pipe(finalize(() => this.signingIn.set(false)))
      .subscribe({
        next: () => void this.router.navigate(['/app/dashboard']),
        error: () =>
          this.snackBar.open('Sign-in failed. Please try again.', 'Dismiss', { duration: 4000 }),
      });
  }
}

