import { Injectable, computed, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';

export type UserRole = 'user' | 'admin';

interface AuthSession {
  token: string;
  role: UserRole;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly tokenKey = 'authToken';
  private readonly roleKey = 'authRole';

  private readonly _token = signal<string | null>(localStorage.getItem(this.tokenKey));
  private readonly _role = signal<UserRole | null>(this.readStoredRole());

  readonly isLoggedIn = computed(() => !!this._token());
  readonly isAdmin = computed(() => this._role() === 'admin');
  readonly role = this._role.asReadonly();

  constructor(private router: Router) {}

  login(session: AuthSession) {
    this._token.set(session.token);
    this._role.set(session.role);
    localStorage.setItem(this.tokenKey, session.token);
    localStorage.setItem(this.roleKey, session.role);
  }

  logout() {
    this._token.set(null);
    this._role.set(null);
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.roleKey);
    this.router.navigate(['/signup']);
  }

  getToken() {
    return this._token();
  }

  getAuthHeaders() {
    const token = this._token();
    if (!token) {
      return new HttpHeaders();
    }

    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  private readStoredRole(): UserRole | null {
    const value = localStorage.getItem(this.roleKey);
    return value === 'admin' || value === 'user' ? value : null;
  }
}
