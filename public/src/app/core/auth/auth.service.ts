import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, delay, of, tap } from 'rxjs';

import { MOCK_USER } from '../mock/mock-data';
import { AppUser } from '../models';

const SESSION_KEY = 'inbox-ledger.session';

/**
 * Authentication facade.
 *
 * MVP: Google sign-in is mocked. To go live, replace the body of
 * `loginWithGoogle()` with Firebase `signInWithPopup(auth, new GoogleAuthProvider())`
 * and `logout()` with `signOut(auth)` — the public API stays the same.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly userSubject = new BehaviorSubject<AppUser | null>(this.restoreSession());

  readonly user$: Observable<AppUser | null> = this.userSubject.asObservable();

  get currentUser(): AppUser | null {
    return this.userSubject.value;
  }

  loginWithGoogle(): Observable<AppUser> {
    return of(MOCK_USER).pipe(
      delay(500),
      tap((user) => {
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
        this.userSubject.next(user);
      }),
    );
  }

  async logout(): Promise<void> {
    sessionStorage.removeItem(SESSION_KEY);
    this.userSubject.next(null);
  }

  isAuthenticated(): boolean {
    return this.userSubject.value !== null;
  }

  private restoreSession(): AppUser | null {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      return raw ? (JSON.parse(raw) as AppUser) : null;
    } catch {
      return null;
    }
  }
}

